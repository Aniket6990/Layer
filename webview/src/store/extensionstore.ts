import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WebViewEventType, NetworkConfig } from "../types";

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
  isHomeTx: boolean;
  isWalletTx: boolean;
  compiledContracts: Array<string>;
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
    eventType: "layer_extensionCall",
    eventResult: "Welcome to ETHcode-layer",
  },
  isHomeTx: false,
  isWalletTx: false,
  compiledContracts: [],
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
    setIsHomeTx(state, action) {
      state.isHomeTx = action.payload;
    },
    setIsWalletTx(state, action) {
      state.isWalletTx = action.payload;
    },
    setCompiledContracts(state, action) {
      state.compiledContracts = action.payload;
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
  setIsHomeTx,
  setIsWalletTx,
  setCompiledContracts,
} = extensionSlice.actions;

export default extensionSlice.reducer;
