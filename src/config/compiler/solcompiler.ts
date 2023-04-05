import * as vscode from "vscode";
import path from "path";
import * as fs from "fs";
import { downloadRemoteVersion } from "./filedownloader";
import { workspace } from "vscode";
import { ReactPanel } from "../../panels/ReactPanel";
import versions from "./versions";
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

const downloadCompiler = async (
  context: vscode.ExtensionContext,
  compilerVersion: string
) => {
  if (!fs.existsSync(path.join(context.extensionPath, "compiler")))
    fs.mkdirSync(path.join(context.extensionPath, "compiler"));
  await downloadRemoteVersion(
    path.join(context.extensionPath, "compiler"),
    compilerVersion
  );
};

export const loadCompiler = async (
  context: vscode.ExtensionContext,
  path_: string,
  compilerVersion: string
) => {
  try {
    if (workspace.workspaceFolders === undefined) {
      vscode.window.showErrorMessage("please open solidity project to work");
      return;
    }

    const extensionPath = workspace.workspaceFolders[0].uri.fsPath;

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

    const availableVersions: any = versions;
    const compilerFile = availableVersions[compilerVersion];

    if (
      fs.existsSync(path.join(context.extensionPath, "compiler", compilerFile))
    ) {
      ReactPanel.EmitExtensionEvent({
        eventStatus: "success",
        eventType: "layer_msg",
        eventResult: "loading compiler...",
      });

      const solidityfile = require(path.join(
        context.extensionPath,
        "compiler",
        compilerFile
      ));

      const localSolc = solc.setupMethods(solidityfile);
      ReactPanel.EmitExtensionEvent({
        eventStatus: "success",
        eventType: "layer_msg",
        eventResult: "compiling...",
      });

      const output = localSolc.compile(JSON.stringify(input), {
        import: (path: any) => importCallback(path),
      });
      fs.writeFileSync(
        path.join(extensionPath, "buildInfo.json"),
        JSON.parse(JSON.stringify(output))
      );

      const outputToWork = JSON.parse(output);

      if (outputToWork.errors !== undefined) {
        ReactPanel.EmitExtensionEvent({
          eventStatus: "fail",
          eventType: "layer_solc_error",
          eventResult: outputToWork.errors,
        });
        return;
      }
      const contractName = Object.keys(
        outputToWork.contracts["MyContract.sol"]
      )[0];
      const contractOutput = JSON.parse(
        JSON.stringify(outputToWork.contracts["MyContract.sol"][contractName])
      );

      const outputToWrite = {
        _format: "layer-sol-artifact",
        contractName: contractName,
        abi: contractOutput.abi,
        bytecode: "0x" + contractOutput.evm.bytecode.object,
      };
      if (
        !fs.existsSync(
          path.join(extensionPath, "artifacts", "contracts", `${contractName}`)
        )
      ) {
        fs.mkdirSync(
          path.join(
            extensionPath,
            "artifacts",
            "contracts",
            `${contractName}.sol`
          ),
          { recursive: true }
        );
      }

      fs.writeFileSync(
        path.join(
          extensionPath,
          "artifacts",
          "contracts",
          `${contractName}.sol`,
          `${contractName}.json`
        ),
        JSON.stringify(outputToWrite)
      );
      ReactPanel.EmitExtensionEvent({
        eventStatus: "success",
        eventType: "layer_extensionCall",
        eventResult: `contract compiled successfully with version: ${localSolc.version()}`,
      });
    } else {
      await downloadCompiler(context, compilerVersion)
        .then(() => {
          loadCompiler(context, path_, compilerVersion);
        })
        .catch((error: any) => {
          ReactPanel.EmitExtensionEvent({
            eventStatus: "fail",
            eventType: "layer_extensionCall",
            eventResult:
              "Error occured while download compiler for compilation: " + error,
          });
        });
    }
  } catch (error) {
    ReactPanel.EmitExtensionEvent({
      eventStatus: "fail",
      eventType: "layer_extensionCall",
      eventResult: "Error while loading the compiler:" + error,
    });
  }
};

export const getCompilerVersions = () => {
  return Object.keys(versions);
};
