import * as vscode from "vscode";
import * as fs from "fs";

export const getConfiguration = () => {
  return vscode.workspace.getConfiguration("layer");
};
export const networkConfig = async (path: string) => {
  try {
    if (fs.existsSync(`${path}/networks.json`)) {
      const networks = fs.readFileSync(`${path}/networks.json`, {
        encoding: "utf-8",
      });
      const parsedNetworksObject = JSON.parse(networks);
      return parsedNetworksObject;
    } else {
      const networks = getConfiguration().get("networks") as Object;
      return networks;
    }
  } catch (error) {
    console.log(error);
  }
};
