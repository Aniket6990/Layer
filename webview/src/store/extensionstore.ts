import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NetworkConfig } from "../types";

interface extensionState {
  networks: any;
  addresses: [];
  selectedNetwork: string | undefined;
  selectedNetworkConfig: any;
  selectedAccount: string | undefined;
}

const initialState: extensionState = {
  networks: {},
  addresses: [],
  selectedNetwork: undefined,
  selectedNetworkConfig: {},
  selectedAccount: undefined,
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
  },
});

export const {
  setNetworks,
  setAccounts,
  setSelectedNetwork,
  setSelectedNetworkConfig,
  setSelectedAccount,
} = extensionSlice.actions;

export default extensionSlice.reducer;
