import { ethers } from "ethers";
import { ExtensionContext } from "vscode";
import { logger } from "../lib";
import { NetworkConfig } from "../types";
import { isValidHttpUrl } from "../utils/networks";
import { createKeyPair, listAddresses } from "../utils/wallet";

const provider = ethers.providers;

export const accountList = async (context: ExtensionContext) => {
  const addresses = await listAddresses(context, context.extensionPath);
  return addresses;
};

export const createNewKeyPair = async (
  context: ExtensionContext,
  password: string
) => {
  try {
    const account = createKeyPair(
      context,
      context.extensionPath,
      password || ""
    );
    return account;
  } catch (error) {
    console.log("Error occured while creating a new account");
  }
};

const getSelectedNetworkProvider = (rpcUrl: string) => {
  if (isValidHttpUrl(rpcUrl)) return new provider.JsonRpcProvider(rpcUrl);

  return provider.getDefaultProvider(rpcUrl);
};

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
    logger.error(new Error("Selected network RPC isn't supported."));
  }
};
