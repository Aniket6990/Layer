import { vscode } from "../utilities/vscode";

export const getNetworks = () => {
  vscode.postMessage({
    command: "get-network-list",
  });
};
