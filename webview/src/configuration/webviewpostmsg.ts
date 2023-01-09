import { vscode } from "../utilities/vscode";

export const getNetworks = () => {
  vscode.postMessage({
    command: "get-network-list",
  });
};

export const getAccounts = () => {
  vscode.postMessage({
    command: "get-account-list",
  });
};

export const createNewKeyPairAccount = (password: string) => {
  vscode.postMessage({
    command: "create-new-keypair",
    data: password,
  });
};
