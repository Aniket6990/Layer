import { ExtensionContext } from "vscode";
import { listAddresses } from "../utils/wallet";

export const accountList = async (context: ExtensionContext) => {
  const addresses = await listAddresses(context, context.extensionPath);
  return addresses;
};
