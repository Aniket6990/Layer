import { FunctionObjectType, NetworkConfig, TxObjecttype } from "../types";
import { vscode } from "../utilities/vscode";

export const getNetworks = () => {
  vscode.postMessage({
    command: "get-network-list",
  });
};

export const getAccounts = (
  networkName: string | undefined,
  rpcUrl: string | undefined
) => {
  vscode.postMessage({
    command: "get-account-list",
    data: {
      networkName: networkName,
      rpcUrl: rpcUrl,
    },
  });
};

export const getWalletAccounts = () => {
  vscode.postMessage({
    command: "get-wallet-account-list",
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

export const loadSolidityContracts = () => {
  vscode.postMessage({
    command: "get-solidity-contracts",
  });
};

export const loadAllContracts = () => {
  vscode.postMessage({
    command: "get-compiled-contracts",
  });
};

export const listContractConstructor = (contractName: string) => {
  vscode.postMessage({
    command: "get-contract-constructor",
    data: {
      contractTitle: contractName,
    },
  });
};

export const deployContract = (
  contractName: string,
  params: string[] | undefined,
  password: string,
  selectedNetwork: string,
  selectedAccount: string,
  rpcURL: string,
  gasLimit: string,
  value: string
) => {
  vscode.postMessage({
    command: "deploy-contract",
    data: {
      contractName: contractName,
      params: params,
      password: password,
      selectedNetwork: selectedNetwork,
      selectedAccount: selectedAccount,
      rpcURL: rpcURL,
      gasLimit: gasLimit,
      value: value,
    },
  });
};

export const getDeployedContracts = (selectedNetwork: string) => {
  vscode.postMessage({
    command: "get-deployed-contracts",
    data: {
      selectedNetwork: selectedNetwork,
    },
  });
};

export const listContractFunctions = (contractName: string) => {
  vscode.postMessage({
    command: "get-contract-functions",
    data: {
      contractTitle: contractName,
    },
  });
};

export const executeContractFunction = (
  contractName: string,
  contractAddress: string,
  functionObject: FunctionObjectType,
  params: string[],
  password: string,
  selectedAccount: string,
  selectedNetwork: string,
  rpcUrl: string,
  gasLimit: string,
  value?: string
) => {
  vscode.postMessage({
    command: "execute-function",
    data: {
      contractName: contractName,
      contractAddress: contractAddress,
      functionObject: functionObject,
      params: params,
      password: password,
      selectedAccount: selectedAccount,
      selectedNetwork: selectedNetwork,
      rpcUrl: rpcUrl,
      gasLimit: gasLimit,
      value: value,
    },
  });
};

export const addNewNetwork = (
  networkTitle: string,
  networkInfo: NetworkConfig
) => {
  vscode.postMessage({
    command: "add-network",
    data: {
      networkTitle: networkTitle,
      networkInfo: networkInfo,
    },
  });
};

export const deleteNetwork = (networkTitle: string) => {
  vscode.postMessage({
    command: "delete-network",
    data: {
      networkTitle: networkTitle,
    },
  });
};

export const unlockAccount = (accountAddress: string, pswd: string) => {
  vscode.postMessage({
    command: "unlock-account",
    data: {
      accountAddress: accountAddress,
      pswd: pswd,
    },
  });
};

export const compileContract = (
  contractPath: string,
  compilerVersion: string
) => {
  vscode.postMessage({
    command: "compile-contract",
    data: {
      contractPath: contractPath,
      compilerVersion: compilerVersion,
    },
  });
};

export const loadCompilerVersions = () => {
  vscode.postMessage({
    command: "load-compiler-versions",
  });
};
