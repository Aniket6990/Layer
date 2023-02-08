import { ethers } from "ethers";
import * as vscode from "vscode";
import { InputBoxOptions, window, commands } from "vscode";
import { CompiledJSONOutput, GanacheAddressType, TxObjecttype } from "./types";
import {
  callContractMethod,
  deployContract,
  displayBalance,
  setTransactionGas,
  updateSelectedNetwork,
} from "./utils/networks";
import { logger } from "./lib";
import {
  createKeyPair,
  deleteKeyPair,
  selectAccount,
  importKeyPair,
  exportKeyPair,
} from "./utils/wallet";
import {
  createERC4907Contract,
  parseBatchCompiledJSON,
  parseCompiledJSONPayload,
  selectContract,
} from "./utils";
import { ReactPanel } from "./panels/ReactPanel";
import {
  displayAccountBalance,
  exportPvtKeyPair,
  networkConfig,
  sendTransaction,
} from "./config";
import { loadAllCompiledContracts } from "./config/contract";
import { createGlobalStyle } from "styled-components";

// eslint-disable-next-line import/prefer-default-export
export async function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    // command for testing
    commands.registerCommand("layer.webview.test", async () => {
      loadAllCompiledContracts(context);
      const contracts = context.workspaceState.get("contracts") as {
        [name: string]: CompiledJSONOutput;
      };
      let data = Object.keys(contracts).map((contract) => {
        return contract;
      });
      console.log(data);
    }),

    // Activate
    commands.registerCommand("layer.activate", async () => {
      ReactPanel.render(context);
    })
  );
}
