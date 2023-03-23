import * as vscode from "vscode";
import { commands } from "vscode";
import { ReactPanel } from "./panels/ReactPanel";

// eslint-disable-next-line import/prefer-default-export
export async function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    // Activate
    commands.registerCommand("layer.activate", async () => {
      ReactPanel.render(context);
    })
  );
}
