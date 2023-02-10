import { ethers } from "ethers";
import * as vscode from "vscode";
import { InputBoxOptions, window, commands } from "vscode";
import { GanacheAddressType, TxObjecttype } from "./types";
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

// eslint-disable-next-line import/prefer-default-export
export async function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    // command for testing
    commands.registerCommand("layer.webview.test", async () => {
      const txObject: TxObjecttype = {
        ownerAddress: "0x94b26bb17c1d1dda9aa731922de782b6119f21f3",
        recipientAddress: "0x329107021C38ceF5d7778C0edF6c9610B5C5E395",
        selectedNetworkRpcUrl: "https://rpc-mumbai.maticvigil.com",
        value: "0.0002",
        gasLimit: "21000",
        pswd: "aniket",
      };
      const data = await sendTransaction(context, txObject);
      console.log(data);
      console.log("typeof:", typeof data);
    }),

    // Activate
    commands.registerCommand("layer.activate", async () => {
      ReactPanel.render(context);
    })
  );
}
