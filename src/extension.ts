import * as vscode from "vscode";
import { commands } from "vscode";
import { ReactPanel } from "./panels/ReactPanel";
import {
  getContractConstructor,
  loadAllCompiledContracts,
} from "./config/contract";

// eslint-disable-next-line import/prefer-default-export
export async function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    // command for testing
    commands.registerCommand("layer.webview.test", async () => {
      getContractConstructor(context, "NonPayableContract");
    }),

    // Activate
    commands.registerCommand("layer.activate", async () => {
      ReactPanel.render(context);
    })
  );
}
