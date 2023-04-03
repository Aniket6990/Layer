import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WebViewEventType, NetworkConfig } from "../types";

interface deployedContractData {
  network: string;
  address: string;
  contractName: string;
}

interface extensionState {
  networks: any;
  addresses: Array<string>;
  selectedNetwork: string;
  selectedNetworkConfig: any;
  selectedAccount: string;
  configBalance: string;
  walletAccount: string;
  walletNetwork: string;
  walletNetworkConfig: any;
  walletAccountBalance: string;
  eventMsg: WebViewEventType | undefined;
  isWalletTx: boolean;
  solidityContracts: Array<string>;
  compiledContracts: Array<string>;
  selectedContract: string;
  selectedContractConstructor: any;
  gasLimit: string;
  execValue: string;
  deployedContracts: Array<deployedContractData>;
  selectedContractFunctions: any;
  globalPswd: string;
  isAccountUnlocked: boolean;
  settingNetworkConfig: NetworkConfig;
  settingNetwork: string;
  compilerVersions: Array<string>;
}

const initialState: extensionState = {
  networks: {},
  addresses: [],
  selectedNetwork: "Select Network",
  selectedNetworkConfig: {},
  selectedAccount: "Select Account",
  configBalance: "0",
  walletAccount: "Select Account",
  walletNetwork: "Select Network",
  walletNetworkConfig: {},
  walletAccountBalance: "0",
  eventMsg: {
    eventStatus: "success",
    eventType: "layer_msg",
    eventResult: "Welcome to ETHcode-layer",
  },
  isWalletTx: false,
  solidityContracts: [],
  compiledContracts: [],
  selectedContract: "Select Contract",
  selectedContractConstructor: undefined,
  gasLimit: "3000000",
  execValue: "0",
  deployedContracts: [],
  selectedContractFunctions: undefined,
  isAccountUnlocked: false,
  globalPswd: "",
  settingNetworkConfig: {
    rpc: "",
    blockScanner: "",
    chainID: "",
    symbol: "",
    decimals: "",
    isDefault: false,
  },
  settingNetwork: "",
  compilerVersions: [],
};
export const extensionSlice = createSlice({
  name: "extension",
  initialState,
  reducers: {
    setNetworks(state, action: PayloadAction<Object>) {
      state.networks = action.payload;
    },
    setAccounts(state, action) {
      state.addresses = action.payload;
    },
    setSelectedNetwork(state, action) {
      state.selectedNetwork = action.payload;
    },
    setSelectedNetworkConfig(state, action: PayloadAction<NetworkConfig>) {
      state.selectedNetworkConfig = action.payload;
    },
    setSelectedAccount(state, action) {
      state.selectedAccount = action.payload;
    },
    setConfigBalance(state, action) {
      state.configBalance = action.payload;
    },
    setWalletAccount(state, action) {
      state.walletAccount = action.payload;
    },
    setWalletNetwork(state, action) {
      state.walletNetwork = action.payload;
    },
    setWalletNetworkConfig(state, action: PayloadAction<NetworkConfig>) {
      state.walletNetworkConfig = action.payload;
    },
    setWalletAccountBalance(state, action) {
      state.walletAccountBalance = action.payload;
    },
    setEventMsg(state, action) {
      state.eventMsg = action.payload;
    },
    setIsWalletTx(state, action) {
      state.isWalletTx = action.payload;
    },
    setSolidityContracts(state, action) {
      state.solidityContracts = action.payload;
    },
    setCompiledContracts(state, action) {
      state.compiledContracts = action.payload;
    },
    setSelectedContract(state, action) {
      state.selectedContract = action.payload;
    },
    setSelectedContractConstructor(state, action) {
      state.selectedContractConstructor = action.payload;
    },
    setGasLimit(state, action) {
      state.gasLimit = action.payload;
    },
    setExecValue(state, action) {
      state.execValue = action.payload;
    },
    setDeployedContracts(state, action) {
      state.deployedContracts = action.payload;
    },
    setSelectedContractFunctions(state, action) {
      state.selectedContractFunctions = action.payload;
    },
    setGlobalPswd(state, action) {
      state.globalPswd = action.payload;
    },
    setIsAccountUnlocked(state, action) {
      state.isAccountUnlocked = action.payload;
    },
    setSettingNetworkConfig(state, action) {
      state.settingNetworkConfig = action.payload;
    },
    setSettingNetwork(state, action) {
      state.settingNetwork = action.payload;
    },
    setCompilerVersions(state, action) {
      state.compilerVersions = action.payload;
    },
  },
});

export const {
  setNetworks,
  setAccounts,
  setSelectedNetwork,
  setSelectedNetworkConfig,
  setSelectedAccount,
  setConfigBalance,
  setWalletAccount,
  setWalletNetwork,
  setWalletNetworkConfig,
  setWalletAccountBalance,
  setEventMsg,
  setIsWalletTx,
  setSolidityContracts,
  setCompiledContracts,
  setSelectedContract,
  setSelectedContractConstructor,
  setGasLimit,
  setExecValue,
  setDeployedContracts,
  setSelectedContractFunctions,
  setGlobalPswd,
  setIsAccountUnlocked,
  setSettingNetworkConfig,
  setSettingNetwork,
  setCompilerVersions,
} = extensionSlice.actions;

export default extensionSlice.reducer;
