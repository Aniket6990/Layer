import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EventType, NetworkConfig } from "../types";

interface extensionState {
  networks: any;
  addresses: Array<string>;
  selectedNetwork: string;
  selectedNetworkConfig: any;
  selectedAccount: string;
  configBalance: string;
  walletAccount: string;
  walletNetwork: string | undefined;
  walletNetworkConfig: any;
  walletAccountBalance: string;
  eventMsg: EventType | undefined;
}

const initialState: extensionState = {
  networks: {},
  addresses: [],
  selectedNetwork: "Select Network",
  selectedNetworkConfig: {},
  selectedAccount: "Select Account",
  configBalance: "0",
  walletAccount: "Select Account",
  walletNetwork: undefined,
  walletNetworkConfig: {},
  walletAccountBalance: "0",
  eventMsg: {
    msgType: "success",
    eventType: "string",
    msg: "Welcome to ETHcode-layer",
  },
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
} = extensionSlice.actions;

export default extensionSlice.reducer;
