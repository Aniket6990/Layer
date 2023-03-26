import { ExtensionContext, workspace, window } from "vscode";
import path from "path";
import * as fs from "fs";
import { logger } from "../lib";
const solc = require("solc");

export const loadSolidityContracts = () => {
  if (workspace.workspaceFolders === undefined) {
    window.showErrorMessage("please open solidity project to work");
    return;
  }

  const path_ = workspace.workspaceFolders[0].uri.fsPath;
  const paths: Array<string> = loadAllSolidityContracts(path_, 0);

  return paths;
};

const flatten = (lists: any) => {
  return lists.reduce((a: any, b: any) => a.concat(b), []);
};

const loadAllSolidityContracts = (path_: string, depth: number) => {
  const contractPath = depth > 0 ? path_ : path.join(path_, "contracts");
  const directories: any = fs.readdirSync(contractPath).map((file) => {
    return fs.statSync(path.join(contractPath, file)).isFile()
      ? path.join(contractPath, file)
      : loadAllSolidityContracts(path.join(contractPath, file), depth + 1);
  });

  const allFiles = [...flatten(directories)];

  const solidityFiles: Array<string> = allFiles.filter(
    (file) => file.substring(file.length - 4) === ".sol"
  );

  return solidityFiles;
};

const importCallback = (path_: any) => {
  const files = loadSolidityContracts();
  const file = files?.filter((file) => file.includes(path_)) as string[];
  let filePath = file[0];

  if (workspace.workspaceFolders === undefined) {
    window.showErrorMessage("please open solidity project to work");
    return;
  }

  const rootPath = workspace.workspaceFolders[0].uri.fsPath;

  //   if path starts with @ then find contract in node_modules

  if (path_.startsWith("@")) {
    filePath = path.join(rootPath, "node_modules", path_);
  }

  const importedFileContent = fs.readFileSync(filePath, "utf8");
  return {
    contents: importedFileContent,
  };
};

export const compileSmartContract = (path_: string) => {
  const contractSource = fs.readFileSync(path_, "utf8");

  const input = {
    language: "Solidity",
    sources: {
      compiledContract: {
        content: contractSource,
      },
    },
    settings: {
      outputSelection: {
        "*": {
          "*": ["abi", "evm.bytecode"],
        },
      },
      optimizer: {
        enabled: true,
        runs: 200,
      },
      evmVersion: "paris",
    },
  };

  const output = JSON.parse(
    solc.compile(JSON.stringify(input), { import: importCallback })
  );
  const contractName = Object.keys(output.contracts["compiledContract"])[0];
  const contractOutput = JSON.parse(
    JSON.stringify(output.contracts["compiledContract"][contractName])
  );

  const outputToWrite = {
    name: contractName,
    abi: contractOutput.abi,
    bytecode: "0x" + contractOutput.evm.bytecode.object,
  };
  if (workspace.workspaceFolders === undefined) {
    window.showErrorMessage("please open solidity project to work");
    return;
  }

  const rootPath = workspace.workspaceFolders[0].uri.fsPath;
  fs.writeFileSync(
    path.join(rootPath, "test.json"),
    JSON.stringify(outputToWrite)
  );
};
