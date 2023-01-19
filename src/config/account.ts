import { ethers } from "ethers";
import * as fs from "fs";
import * as vscode from "vscode";
const keythereum = require("keythereum");
import { ExtensionContext } from "vscode";
import { logger } from "../lib";
import { NetworkConfig, ReturnDataType, TxObjecttype } from "../types";
import {
  getSelectedProvider,
  isTestingNetwork,
  isValidHttpUrl,
} from "../utils/networks";
import { toChecksumAddress } from "../lib/hash/util";
import { Account, LocalAddressType } from "../types";

const provider = ethers.providers;
// list all local addresses
export const listAddresses = async (
  context: vscode.ExtensionContext,
  keyStorePath: string
): Promise<string[]> => {
  try {
    let localAddresses: LocalAddressType[];

    if (isTestingNetwork(context)) {
      const provider = getSelectedProvider(
        context
      ) as ethers.providers.JsonRpcProvider;
      const account = await provider.listAccounts();
      return account;
    }

    if (!fs.existsSync(`${keyStorePath}/keystore`)) {
      fs.mkdirSync(`${keyStorePath}/keystore`);
    }

    const files = fs.readdirSync(`${keyStorePath}/keystore`);

    localAddresses = files.map((file) => {
      const arr = file.split("--");
      return {
        pubAddress: `0x${arr[arr.length - 1]}`,
        checksumAddress: toChecksumAddress(`0x${arr[arr.length - 1]}`),
      };
    });

    return localAddresses.map((e) => e.pubAddress);
  } catch (err) {
    console.log("Error while listing wallets");
    return [];
  }
};

// create new key pair
export const createNewKeyPair = (
  context: vscode.ExtensionContext,
  path: string,
  pswd: string
) => {
  let returnMsg: ReturnDataType;
  try {
    const params = { keyBytes: 32, ivBytes: 16 };
    const bareKey = keythereum.create(params);
    const options = {
      kdf: "scrypt",
      cipher: "aes-128-ctr",
    };
    const keyObject = keythereum.dump(
      Buffer.from(pswd, "utf-8"),
      bareKey.privateKey,
      bareKey.salt,
      bareKey.iv,
      options
    );
    const account: Account = {
      pubAddr: keyObject.address,
      checksumAddr: toChecksumAddress(keyObject.address),
    };

    if (!fs.existsSync(`${path}/keystore`)) {
      fs.mkdirSync(`${path}/keystore`);
    }
    keythereum.exportToFile(keyObject, `${path}/keystore`);
    listAddresses(context, path);
    returnMsg = {
      msgType: "success",
      eventType: "string",
      msg: `New Account ${account.checksumAddr} created successfully.`,
    };
    return returnMsg;
  } catch (error) {
    returnMsg = {
      msgType: "error",
      eventType: "string",
      msg: `Error occured while creating a new account`,
    };
    return returnMsg;
  }
};

// create new key pair using pvtKey
export const createAccountFromKey = (
  context: vscode.ExtensionContext,
  path: string,
  pswd: string,
  pvtKey: string
) => {
  let returnMsg: ReturnDataType;
  try {
    const params = { keyBytes: 32, ivBytes: 16 };
    const bareKey = keythereum.create(params);
    const options = {
      kdf: "scrypt",
      cipher: "aes-128-ctr",
    };
    const keyObject = keythereum.dump(
      Buffer.from(pswd, "utf-8"),
      pvtKey,
      bareKey.salt,
      bareKey.iv,
      options
    );
    const account: Account = {
      pubAddr: keyObject.address,
      checksumAddr: toChecksumAddress(keyObject.address),
    };

    if (!fs.existsSync(`${path}/keystore`)) {
      fs.mkdirSync(`${path}/keystore`);
    }
    keythereum.exportToFile(keyObject, `${path}/keystore`);
    listAddresses(context, path);
    returnMsg = {
      msgType: "success",
      eventType: "string",
      msg: `New Account ${account.checksumAddr} created successfully.`,
    };
    return returnMsg;
  } catch (error) {
    returnMsg = {
      msgType: "error",
      eventType: "string",
      msg: `Error occured while creating a new account`,
    };
    return returnMsg;
  }
};

export const importNewKeyPair = async (context: ExtensionContext) => {
  let returnMsg: ReturnDataType;
  try {
    let msg: any;
    const options: vscode.OpenDialogOptions = {
      canSelectMany: false,
      openLabel: "Open",
      filters: {
        "All files": ["*"],
      },
    };

    const addresses = await listAddresses(context, context.extensionPath);

    await vscode.window.showOpenDialog(options).then((fileUri) => {
      if (fileUri && fileUri[0]) {
        const arrFilePath = fileUri[0].fsPath.split("\\");
        const file = arrFilePath[arrFilePath.length - 1];
        const arr = file.split("--");
        const address = toChecksumAddress(`0x${arr[arr.length - 1]}`);

        const already = addresses.find(
          (element: string) => toChecksumAddress(element) === address
        );

        if (already !== undefined) {
          msg = {
            msgType: "error",
            eventType: "string",
            msg: `Account ${address} is already exist.`,
          };
        } else {
          fs.copyFile(
            fileUri[0].fsPath,
            `${context.extensionPath}/keystore/${file}`,
            (err) => {
              if (err) throw err;
            }
          );
          msg = {
            msgType: "success",
            eventType: "string",
            msg: `Account ${address} is successfully imported!`,
          };
        }
      }
    });
    returnMsg = msg;
    return returnMsg;
  } catch (error) {
    returnMsg = {
      msgType: "error",
      eventType: "string",
      msg: `Error occured while importing a account.`,
    };
    return returnMsg;
  }
};

const getSelectedNetworkProvider = (rpcUrl: string) => {
  if (isValidHttpUrl(rpcUrl)) return new provider.JsonRpcProvider(rpcUrl);

  return provider.getDefaultProvider(rpcUrl);
};

// display balance of selected address on selected network
export const displayAccountBalance = async (
  selectedAddress: string,
  selectedNetworkRpcUrl: string
) => {
  try {
    const balance = getSelectedNetworkProvider(selectedNetworkRpcUrl)
      .getBalance(selectedAddress)
      .then(async (value) => {
        const bal = ethers.utils.formatEther(value);
        return bal;
      });
    return balance;
  } catch (_) {
    console.log("Selected network RPC isn't supported.");
  }
};

export const exportPvtKeyPair = async (
  context: ExtensionContext,
  address: string,
  pswd: string
) => {
  let returnMsg = {
    msgType: "",
    eventType: "",
    msg: "",
  };
  try {
    const keyObject = keythereum.importFromFile(address, context.extensionPath);
    const bufferPvtKey = keythereum.recover(
      Buffer.from(pswd, "utf-8"),
      keyObject
    );
    const pvtKey = new ethers.Wallet(bufferPvtKey).privateKey;
    returnMsg = { msgType: "success", eventType: "string", msg: pvtKey };
    return returnMsg;
  } catch (error) {
    returnMsg = {
      msgType: "error",
      eventType: "string",
      msg: "Password is wrong, please enter a correct password.",
    };
    return returnMsg;
  }
};

export const exportPvtKeyPairFile = async (
  context: vscode.ExtensionContext,
  selectedAddress: string
) => {
  let returnMsg = {
    msgType: "",
    eventType: "",
    msg: "",
  };
  try {
    const files = fs.readdirSync(`${context.extensionPath}/keystore`);
    const address = selectedAddress.slice(2, selectedAddress.length);
    let selectedFile = "";
    files.map((file: string) => {
      const arr = file.split("--");
      if (address === arr[arr.length - 1]) {
        selectedFile = file;
      }
    });

    const options: vscode.OpenDialogOptions = {
      canSelectMany: false,
      canSelectFolders: true,
      openLabel: "Save",
      filters: {
        "All files": ["*"],
      },
    };

    await vscode.window.showOpenDialog(options).then((fileUri) => {
      if (fileUri && fileUri[0]) {
        fs.copyFile(
          `${context.extensionPath}\\keystore\\${selectedFile}`,
          `${fileUri[0].fsPath}\\${selectedFile}`,
          (err) => {
            if (err) throw err;
          }
        );
        returnMsg = {
          msgType: "success",
          eventType: "string",
          msg: `Account ${selectedAddress} exported successfully to ${fileUri[0].fsPath}`,
        };
      }
    });
    return returnMsg;
  } catch (error) {
    returnMsg = {
      msgType: "error",
      eventType: "string",
      msg: `Error occoured while exporting account ${selectedAddress}`,
    };
    return returnMsg;
  }
};

// send token transaction
export const sendTransaction = async (
  context: ExtensionContext,
  txObject: TxObjecttype
) => {
  let returnMsg: ReturnDataType;
  try {
    const provider = getSelectedNetworkProvider(txObject.selectedNetworkRpcUrl);
    const pvtKey = await exportPvtKeyPair(
      context,
      txObject.ownerAddress,
      txObject.pswd
    );
    const txData = {
      to: txObject.recipientAddress,
      value: ethers.utils.parseEther(txObject.value),
      gasLimit: txObject.gasLimit,
    };
    if (pvtKey.msgType === "success") {
      console.log("password is correct ji.");
      const wallet = new ethers.Wallet(pvtKey.msg, provider);
      const tx = await wallet.sendTransaction(txData);
      const sumittedTx = await tx.wait();
      returnMsg = {
        msgType: "success",
        eventType: "txObject",
        msg: sumittedTx.transactionHash,
      };
    } else {
      console.log("password is wrong ji.");
      returnMsg = {
        msgType: "error",
        eventType: "string",
        msg: `Please enter a valid password, password is not correct.`,
      };
    }
    return returnMsg;
  } catch (error: any) {
    returnMsg = {
      msgType: "error",
      eventType: "string",
      msg: error.body,
    };
    return returnMsg;
  }
};
