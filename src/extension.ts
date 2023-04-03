import * as vscode from "vscode";
import { commands } from "vscode";
import { ReactPanel } from "./panels/ReactPanel";
import {
  loadCompiler,
  loadSolidityContracts,
} from "./config/compiler/solcompiler";

// eslint-disable-next-line import/prefer-default-export
export async function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    // Activate
    commands.registerCommand("layer.activate", async () => {
      ReactPanel.render(context);
    }),
    commands.registerCommand("layer.test", async () => {
      const paths = loadSolidityContracts();
      console.log(paths);
      if (paths !== undefined) loadCompiler(context, paths[0]);
    })
  );
}
