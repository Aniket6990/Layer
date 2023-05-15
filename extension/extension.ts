import * as vscode from "vscode";
import { commands } from "vscode";
import { ReactPanel } from "./panels/ReactPanel";
import {
  loadCompiler,
  loadSolidityContracts,
} from "./config/compiler/solcompiler";
import { getFoundryOutDir } from "./utilities/functions";
import { logger } from "./lib";

// eslint-disable-next-line import/prefer-default-export
export async function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    // Activate
    commands.registerCommand("layer.activate", async () => {
      ReactPanel.render(context);
    })
    // commands.registerCommand("layer.test", async () => {
    //   if (vscode.workspace.workspaceFolders === undefined) {
    //     logger.error(new Error("Please open your solidity project to vscode"));
    //     return;
    //   }

    //   context.workspaceState.update("contracts", ""); // Initialize contracts storage

    //   const path_ = vscode.workspace.workspaceFolders[0].uri.fsPath;
    //   const outDir = getFoundryOutDir(path_);
    //   console.log(outDir)
    // })
  );
}
