import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NetworkConfig } from "../types";

interface extensionState {
  networks: any;
  addresses: [];
  selectedNetwork: string | undefined;
  selectedNetworkConfig: any;
  selectedAccount: string | undefined;
  configBalance: string;
  walletAccount: string | undefined;
  walletNetwork: string | undefined;
  walletNetworkConfig: any;
  walletAccountBalance: string;
}

const initialState: extensionState = {
  networks: {},
  addresses: [],
  selectedNetwork: undefined,
  selectedNetworkConfig: {},
  selectedAccount: undefined,
  configBalance: "0",
  walletAccount: undefined,
  walletNetwork: undefined,
  walletNetworkConfig: {},
  walletAccountBalance: "0",
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
} = extensionSlice.actions;

export default extensionSlice.reducer;
