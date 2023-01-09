import { ExtensionContext } from "vscode";
import { createKeyPair, listAddresses } from "../utils/wallet";

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
