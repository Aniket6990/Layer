import { ExtensionContext } from "vscode";
import { getConfiguration } from "../utils/networks";

export const networkConfig = async (context: ExtensionContext) => {
  try {
    const networks = getConfiguration().get("networks") as Object;
    return networks;
  } catch (error) {
    console.log(error);
  }
};
