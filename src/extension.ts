import * as vscode from "vscode";
import path from "path";
import { commands } from "vscode";
import { compileSmartContract, loadSolidityContracts } from "./config/compiler";
import { ReactPanel } from "./panels/ReactPanel";

// eslint-disable-next-line import/prefer-default-export
export async function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    // Activate
    commands.registerCommand("layer.activate", async () => {
      ReactPanel.render(context);
    }),

    commands.registerCommand("layer.test", async () => {
      const paths = loadSolidityContracts();
      if (paths !== undefined) compileSmartContract(paths[6]);
    })
  );
}
