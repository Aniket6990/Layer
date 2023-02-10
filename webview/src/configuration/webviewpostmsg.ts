import { TxObjecttype } from "../types";
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

export const displayAccountBalance = (
  selectedAccount: string,
  selectedNetworkRpcUrl: string
) => {
  vscode.postMessage({
    command: "get-account-balance",
    data: {
      selectedAccount: selectedAccount,
      selectedNetworkRpcUrl: selectedNetworkRpcUrl,
    },
  });
};

export const displayWalletAccountBalance = (
  selectedAccount: string,
  selectedNetworkRpcUrl: string
) => {
  vscode.postMessage({
    command: "get-wallet-balance",
    data: {
      selectedAccount: selectedAccount,
      selectedNetworkRpcUrl: selectedNetworkRpcUrl,
    },
  });
};

export const importAccountFromKey = (pvtKey: string, password: string) => {
  vscode.postMessage({
    command: "import-account-key",
    data: {
      pvtKey: pvtKey,
      password: password,
    },
  });
};

export const importAccount = () => {
  vscode.postMessage({
    command: "import-account",
  });
};

export const exportAccountPvtKey = (
  walletSelectedAddress: string,
  pswd: string
) => {
  vscode.postMessage({
    command: "export-account-key",
    data: {
      walletSelectedAccount: walletSelectedAddress,
      pswd: pswd,
    },
  });
};

export const exportAccountPvtKeyFile = (walletSelectedAddress: string) => {
  vscode.postMessage({
    command: "export-account",
    data: {
      walletSelectedAccount: walletSelectedAddress,
    },
  });
};

export const sendTokenTransaction = (txObject: TxObjecttype) => {
  vscode.postMessage({
    command: "send-token",
    data: {
      txObject: txObject,
    },
  });
};

export const loadAllContracts = () => {
  vscode.postMessage({
    command: "get-compiled-contracts",
  });
};
