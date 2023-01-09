import { ExtensionContext } from "vscode";
import { getConfiguration } from "../utils/networks";

export const networkConfig = async () => {
  try {
    const networks = getConfiguration().get("networks") as Object;
    return networks;
  } catch (error) {
    console.log(error);
  }
};
