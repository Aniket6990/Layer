import * as vscode from "vscode";
import { commands } from "vscode";
import { ReactPanel } from "./panels/ReactPanel";
import {
  fetchDeployedContract,
  getContractConstructor,
  getContractFunctions,
  loadAllCompiledContracts,
} from "./config/contract";
import { addNetwork } from "./config/ext-config";

// eslint-disable-next-line import/prefer-default-export
export async function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    // command for testing
    commands.registerCommand("layer.webview.test", async () => {}),

    // Activate
    commands.registerCommand("layer.activate", async () => {
      ReactPanel.render(context);
    })
  );
}
