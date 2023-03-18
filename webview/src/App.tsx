import styled from "styled-components";
import { Routes, Route } from "react-router-dom";
import ConsoleArea from "./components/ConsoleArea";
import SideBar from "./components/SideBar";
import ExecutionPage from "./pages/ExecutionPage";
import WalletPage from "./pages/WalletPage";
import { withRouter } from "./utilities/withRouter";
import {
  getAccounts,
  getDeployedContracts,
  getNetworks,
  loadAllContracts,
} from "./configuration/webviewpostmsg";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import {
  setNetworks,
  setAccounts,
  setConfigBalance,
  setWalletAccountBalance,
  setEventMsg,
  setCompiledContracts,
  setSelectedContractConstructor,
  setDeployedContracts,
  setSelectedContractFunctions,
  setIsAccountUnlocked,
  setGlobalPswd,
} from "./store/extensionstore";
import { NetworkConfig } from "./types";
import NetworkSettings from "./pages/NetworkSettings";

const Main = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  display: grid;
  grid-template-columns: 1fr 0.1fr;
  grid-template-rows: 1fr;
  padding: 20px;
`;

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 0.3fr;
  row-gap: 20px;
`;

function App() {
  const Execution = withRouter(ExecutionPage);
  const Wallet = withRouter(WalletPage);
  const dispatch = useAppDispatch();
  const selectedNetwork = useAppSelector(
    (state) => state.extension.selectedNetwork
  );
  const selectedNetworkConfig: NetworkConfig = useAppSelector(
    (state) => state.extension.selectedNetworkConfig
  );

  const selectedAccount = useAppSelector(
    (state) => state.extension.selectedAccount
  );

  useEffect(() => {
    getNetworks();
    getAccounts(selectedNetwork, selectedNetworkConfig.rpc);
    loadAllContracts();
  }, []);

  useEffect(() => {
    getAccounts(selectedNetwork, selectedNetworkConfig.rpc);
  }, [selectedNetwork, selectedNetworkConfig]);

  useEffect(() => {
    dispatch(setGlobalPswd(""));
    dispatch(setIsAccountUnlocked(false));
  }, [selectedAccount]);

  useEffect(() => {
    const fn = (event: any) => {
      const eventData = event.data;
      switch (eventData.command) {
        case "post-network-list": {
          dispatch(setNetworks(eventData.data));
          break;
        }
        case "post-account-list": {
          dispatch(setAccounts(eventData.data));
          break;
        }
        case "new-keypair-created": {
          dispatch(setEventMsg(eventData.data));
          break;
        }
        case "post-account-balance": {
          dispatch(setConfigBalance(eventData.data));
          break;
        }
        case "post-wallet-balance": {
          dispatch(setWalletAccountBalance(eventData.data));
          break;
        }
        case "imported-account-key": {
          dispatch(setEventMsg(eventData.data));
          getAccounts(selectedNetwork, selectedNetworkConfig.rpc);
          break;
        }
        case "imported-account": {
          dispatch(setEventMsg(eventData.data));
          getAccounts(selectedNetwork, selectedNetworkConfig.rpc);
          break;
        }
        case "send-token-result": {
          dispatch(setEventMsg(eventData.data));
          break;
        }
        case "post-compiled-contracts": {
          dispatch(setCompiledContracts(eventData.data));
          break;
        }
        case "post-contract-constructor": {
          dispatch(setSelectedContractConstructor(eventData.data));
          break;
        }
        case "contract-deployed": {
          dispatch(setEventMsg(eventData.data));
          getDeployedContracts(selectedNetwork);
          break;
        }
        case "post-deployed-contracts": {
          dispatch(setDeployedContracts(eventData.data));
          break;
        }
        case "post-contract-functions": {
          dispatch(setSelectedContractFunctions(eventData.data));
          break;
        }
        case "function-executed": {
          if (eventData.data !== undefined) {
            dispatch(setEventMsg(eventData.data));
          }
          break;
        }
        case "network-added": {
          if (eventData.data !== undefined) {
            dispatch(setEventMsg(eventData.data));
          }
          getNetworks();
          break;
        }
        case "network-deleted": {
          if (eventData.data !== undefined) {
            dispatch(setEventMsg(eventData.data));
          }
          getNetworks();
          break;
        }
        case "account-unlocked": {
          if (eventData.data.eventStatus === "success")
            dispatch(setIsAccountUnlocked(true));
          dispatch(setEventMsg(eventData.data));
          getNetworks();
          break;
        }
        case "extension-event": {
          dispatch(setEventMsg(eventData.data));
          break;
        }
        default: {
          console.log("Invalid event", event.data);
          break;
        }
      }
    };
    window.addEventListener("message", fn);
    return () => {
      window.removeEventListener("message", fn);
    };
  }, [dispatch, selectedNetwork, selectedNetworkConfig.rpc]);

  return (
    <Main>
      <Wrapper>
        <Routes>
          <Route path="/" element={<Execution />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/networksetting" element={<NetworkSettings />} />
        </Routes>
        <ConsoleArea />
      </Wrapper>
      <SideBar />
    </Main>
  );
}

export default App;
