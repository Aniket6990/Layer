import { ethers } from "ethers";
import * as fs from "fs";
import * as vscode from "vscode";
const keythereum = require("keythereum");
import { ExtensionContext } from "vscode";
import { logger } from "../lib";
import { NetworkConfig } from "../types";
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
    return account.checksumAddr;
  } catch (error) {
    console.log("Error while creating key pair");
  }
};

// create new key pair using pvtKey
export const createAccountFromKey = (
  context: vscode.ExtensionContext,
  path: string,
  pswd: string,
  pvtKey: string
) => {
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
    return account.checksumAddr;
  } catch (error) {
    console.log("Error while creating key pair");
  }
};

export const importNewKeyPair = async (context: ExtensionContext) => {
  try {
    var msg: string = "";
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
          msg = `Account ${address} is already exist.`;
        } else {
          fs.copyFile(
            fileUri[0].fsPath,
            `${context.extensionPath}/keystore/${file}`,
            (err) => {
              if (err) throw err;
            }
          );
          msg = `Account ${address} is successfully imported!`;
        }
      }
    });
    return msg;
  } catch (error) {
    return "Error occoured while importing new account.";
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
