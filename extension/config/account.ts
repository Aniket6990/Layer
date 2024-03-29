import { ethers } from "ethers";
import * as fs from "fs";
import * as vscode from "vscode";
const keythereum = require("keythereum");
import { ExtensionContext } from "vscode";
import { logger } from "../lib";
import { NetworkConfig, ExtensionEventTypes, TxObjecttype } from "../types";
import { toChecksumAddress } from "../lib/hash/util";
import { Account, LocalAddressType } from "../types";
import {
  generateTxnInterface,
  getTransactionError,
  isTestingNetwork,
  isValidHttpUrl,
} from "../utilities/functions";

const provider = ethers.providers;
// list all local addresses
export const listAddresses = async (
  keyStorePath: string,
  networkName?: string,
  rpcUrl?: string
): Promise<string[]> => {
  try {
    let localAddresses: LocalAddressType[];

    if (networkName !== undefined && isTestingNetwork(networkName)) {
      const provider = getSelectedNetworkProvider(
        rpcUrl as string
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
  let extensionEvent: ExtensionEventTypes;
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
      checksumAddr: ethers.utils.getAddress(keyObject.address),
    };

    if (!fs.existsSync(`${path}/keystore`)) {
      fs.mkdirSync(`${path}/keystore`);
    }
    keythereum.exportToFile(keyObject, `${path}/keystore`);
    listAddresses(path);
    extensionEvent = {
      eventStatus: "success",
      eventType: "layer_extensionCall",
      eventResult: `New Account ${account.checksumAddr} created successfully.`,
    };
    return extensionEvent;
  } catch (error) {
    extensionEvent = {
      eventStatus: "fail",
      eventType: "layer_extensionCall",
      eventResult: `Error occured while creating a new account`,
    };
    return extensionEvent;
  }
};

// create new key pair using pvtKey
export const createAccountFromKey = async (
  context: vscode.ExtensionContext,
  path: string,
  pswd: string,
  pvtKey: string
) => {
  let extensionEvent: ExtensionEventTypes;
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
      checksumAddr: ethers.utils.getAddress(keyObject.address),
    };
    const accounts = await listAddresses(context.extensionPath);

    const alreadyExist = accounts.find(
      (acc: string) => toChecksumAddress(acc) === account.checksumAddr
    );

    if (alreadyExist !== undefined) {
      extensionEvent = {
        eventStatus: "fail",
        eventType: "layer_extensionCall",
        eventResult: `Account ${account.checksumAddr} already exist.`,
      };
    } else {
      if (!fs.existsSync(`${path}/keystore`)) {
        fs.mkdirSync(`${path}/keystore`);
      }
      keythereum.exportToFile(keyObject, `${path}/keystore`);
      listAddresses(path);
      extensionEvent = {
        eventStatus: "success",
        eventType: "layer_extensionCall",
        eventResult: `New Account ${account.checksumAddr} added successfully.`,
      };
    }

    return extensionEvent;
  } catch (error) {
    extensionEvent = {
      eventStatus: "fail",
      eventType: "layer_extensionCall",
      eventResult: `Error occured while creating a new account`,
    };
    return extensionEvent;
  }
};

export const importNewKeyPair = async (context: ExtensionContext) => {
  let extensionEvent: ExtensionEventTypes = {
    eventStatus: "fail",
    eventType: "layer_extensionCall",
    eventResult: "Error occured while importing a account.",
  };
  try {
    let msg: any;
    const options: vscode.OpenDialogOptions = {
      canSelectMany: false,
      openLabel: "Open",
      filters: {
        "All files": ["*"],
      },
    };

    const addresses = await listAddresses(context.extensionPath);

    await vscode.window.showOpenDialog(options).then((fileUri) => {
      if (fileUri && fileUri[0]) {
        const arrFilePath = fileUri[0].fsPath.split("\\");
        const file = arrFilePath[arrFilePath.length - 1];
        const arr = file.split("--");
        const address = ethers.utils.getAddress(`0x${arr[arr.length - 1]}`);

        const alreadyExist = addresses.find(
          (element: string) => ethers.utils.getAddress(element) === address
        );

        if (alreadyExist !== undefined) {
          extensionEvent = {
            eventStatus: "fail",
            eventType: "layer_extensionCall",
            eventResult: `Account ${address} already exist.`,
          };
        } else {
          fs.copyFile(
            fileUri[0].fsPath,
            `${context.extensionPath}/keystore/${file}`,
            (err) => {
              if (err) throw err;
            }
          );
          extensionEvent = {
            eventStatus: "success",
            eventType: "layer_extensionCall",
            eventResult: `Account ${address} is successfully imported!`,
          };
        }
      }
    });
    return extensionEvent;
  } catch (error) {
    extensionEvent = {
      eventStatus: "fail",
      eventType: "layer_extensionCall",
      eventResult: `Error occured while importing a account.`,
    };
    return extensionEvent;
  }
};

export const getSelectedNetworkProvider = (
  rpcUrl: string
): ethers.providers.JsonRpcProvider | ethers.providers.BaseProvider => {
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
  let extensionEvent: ExtensionEventTypes;
  try {
    const keyObject = keythereum.importFromFile(address, context.extensionPath);
    const bufferPvtKey = keythereum.recover(
      Buffer.from(pswd, "utf-8"),
      keyObject
    );
    const pvtKey = new ethers.Wallet(bufferPvtKey).privateKey;
    extensionEvent = {
      eventStatus: "success",
      eventType: "layer_extensionCall",
      eventResult: pvtKey,
    };
    return extensionEvent;
  } catch (error) {
    extensionEvent = {
      eventStatus: "fail",
      eventType: "layer_extensionCall",
      eventResult: "Password is wrong, please enter a correct password.",
    };
    return extensionEvent;
  }
};

export const exportPvtKeyPairFile = async (
  context: vscode.ExtensionContext,
  selectedAddress: string
) => {
  let extensionEvent: ExtensionEventTypes = {
    eventStatus: "fail",
    eventType: "layer_extensionCall",
    eventResult: "",
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
        extensionEvent = {
          eventStatus: "success",
          eventType: "layer_extensionCall",
          eventResult: `Account ${selectedAddress} exported successfully to ${fileUri[0].fsPath}`,
        };
      }
    });
    return extensionEvent;
  } catch (error) {
    extensionEvent = {
      eventStatus: "fail",
      eventType: "layer_extensionCall",
      eventResult: `Error occoured while exporting account ${selectedAddress}`,
    };
    return extensionEvent;
  }
};

//unlockAccount

export const unlockSelectedAccount = async (
  context: ExtensionContext,
  accountAddress: string,
  pswd: string
) => {
  let extensionEvent: ExtensionEventTypes;
  const pvtKey = await exportPvtKeyPair(context, accountAddress, pswd);
  if (pvtKey.eventStatus === "success") {
    extensionEvent = {
      eventStatus: "success",
      eventType: "layer_extensionCall",
      eventResult: "Account unlocked.",
    };
  } else {
    extensionEvent = {
      eventStatus: "fail",
      eventType: "layer_extensionCall",
      eventResult: "Password is wrong.",
    };
  }
  return extensionEvent;
};

// send token transaction
export const sendTransaction = async (
  context: ExtensionContext,
  txObject: TxObjecttype
) => {
  let extensionEvent: ExtensionEventTypes;
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
    if (pvtKey.eventStatus === "success") {
      const wallet = new ethers.Wallet(pvtKey.eventResult as string, provider);
      const tx = await wallet.sendTransaction(txData);
      const submittedTx = await tx.wait();
      extensionEvent = {
        eventStatus: "success",
        eventType: "layer_mutableCall",
        eventResult: await generateTxnInterface({
          gasLimit: txObject.gasLimit,
          receipt: submittedTx,
          rpcUrl: txObject.selectedNetworkRpcUrl,
        }),
      };
    } else {
      extensionEvent = {
        eventStatus: "fail",
        eventType: "layer_extensionCall",
        eventResult: `Please enter a valid password, password is not correct.`,
      };
    }
    return extensionEvent;
  } catch (error: any) {
    extensionEvent = await getTransactionError(error, {
      rpcUrl: txObject.selectedNetworkRpcUrl,
      gasLimit: txObject.gasLimit,
    });
    return extensionEvent;
  }
};
