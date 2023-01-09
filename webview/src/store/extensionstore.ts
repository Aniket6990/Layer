import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NetworkConfig } from "../types";

interface extensionState {
  networks: any;
  addresses: [];
  selectedNetwork: string | undefined;
  selectedNetworkConfig: any;
}

const initialState: extensionState = {
  networks: {},
  addresses: [],
  selectedNetwork: undefined,
  selectedNetworkConfig: {},
};
export const extensionSlice = createSlice({
  name: "extension",
  initialState,
  reducers: {
    setNetwork(state, action: PayloadAction<Object>) {
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
  },
});

export const {
  setNetwork,
  setAccounts,
  setSelectedNetwork,
  setSelectedNetworkConfig,
} = extensionSlice.actions;

export default extensionSlice.reducer;
