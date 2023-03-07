import * as vscode from "vscode";

const getConfiguration = () => {
  return vscode.workspace.getConfiguration("layer");
};
export const networkConfig = async () => {
  try {
    const networks = getConfiguration().get("networks") as Object;
    return networks;
  } catch (error) {
    console.log(error);
  }
};
