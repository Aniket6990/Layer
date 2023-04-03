import * as vscode from "vscode";
import path from "path";
import * as fs from "fs";
import { downloadRemoteVersion } from "./filedownloader";
import { workspace } from "vscode";
const solc = require("solc");

export const loadSolidityContracts = () => {
  if (workspace.workspaceFolders === undefined) {
    vscode.window.showErrorMessage("please open solidity project to work");
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
    vscode.window.showErrorMessage("please open solidity project to work");
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

const downLoadCompiler = async (context: vscode.ExtensionContext) => {
  await downloadRemoteVersion(path.join(context.extensionPath, "compiler"));
};

export const loadCompiler = async (
  context: vscode.ExtensionContext,
  path_: string
) => {
  const name = ["fsf", "fs", "fs"];
  name.splice;

  try {
    const contractSource = fs.readFileSync(path_, "utf8");
    const input = {
      language: "Solidity",
      sources: {
        "MyContract.sol": {
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
      },
    };
    if (
      fs.existsSync(
        path.join(
          context.extensionPath,
          "compiler",
          "soljson-v0.8.16+commit.07a7930e.js"
        )
      )
    ) {
      console.log("loading compiler...");
      const solidityfile = require(path.join(
        context.extensionPath,
        "compiler",
        "soljson-v0.8.16+commit.07a7930e.js"
      ));
      const localSolc = solc.setupMethods(solidityfile);
      console.log(`loaded version ${localSolc.version()}`);
      const output = localSolc.compile(JSON.stringify(input), {
        import: (path: any) => importCallback(path),
      });
      console.log(JSON.stringify(output));
      fs.writeFileSync("./buildInfo.json", JSON.parse(JSON.stringify(output)));

      const outputToWork = JSON.parse(output);

      if (outputToWork.errors !== undefined) {
        console.log(`Error: ${outputToWork.errors[0].formattedMessage}`);
        return;
      }
      const contractOutput = JSON.parse(
        JSON.stringify(outputToWork.contracts["MyContract.sol"]["ContractA"])
      );

      const outputToWrite = {
        name: "Mytoken",
        abi: contractOutput.abi,
        bytecode: "0x" + contractOutput.evm.bytecode.object,
      };
      fs.writeFileSync("./test.json", JSON.stringify(outputToWrite));
      console.log(
        `contract compiled successfully with version: ${localSolc.version()}`
      );
    } else {
      downLoadCompiler(context)
        .then(() => {
          loadCompiler(context, path_);
        })
        .catch((error) => {
          console.log(
            "Error occured while download compiler for compilation: " + error
          );
        });
    }
  } catch (error) {
    console.log("Error while loading the compiler:" + error);
  }
};
