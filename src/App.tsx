import styled from "styled-components";
import { Routes, Route } from "react-router-dom";
import ConsoleArea from "./components/ConsoleArea";
import SideBar from "./components/SideBar";
import ExecutionPage from "./pages/ExecutionPage";
import WalletPage from "./pages/WalletPage";
import { withRouter } from "./utilities/withRouter";
import {
  displayAccountBalance,
  displayWalletAccountBalance,
  getAccounts,
  getDeployedContracts,
  getNetworks,
  getWalletAccounts,
  loadAllContracts,
  loadCompilerVersions,
  loadSolidityContracts,
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
  setSolidityContracts,
  setCompilerVersions,
  setWalletAccounts,
} from "./store/extensionstore";
import { NetworkConfig } from "./types";
import NetworkSettings from "./pages/NetworkSettings";

const Main = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  display: grid;
  grid-template-columns: 1fr 0.03fr;
  grid-template-rows: 1fr 0.5fr;
  padding-top: 20px;
  padding-bottom: 20px;
  margin: 0;
`;

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
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

  const walletAccount = useAppSelector(
    (state) => state.extension.walletAccount
  );

  const walletNetConfig: NetworkConfig = useAppSelector(
    (state) => state.extension.walletNetworkConfig
  );

  useEffect(() => {
    getNetworks();
    getWalletAccounts();
    getAccounts(selectedNetwork, selectedNetworkConfig.rpc);
    loadSolidityContracts();
    loadAllContracts();
    loadCompilerVersions();
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
        case "post-wallet-account-list": {
          dispatch(setWalletAccounts(eventData.data));
          break;
        }
        case "post-compiler-versions": {
          dispatch(setCompilerVersions(eventData.data));
          break;
        }
        case "new-keypair-created": {
          dispatch(setEventMsg(eventData.data));
          getAccounts(selectedNetwork, selectedNetworkConfig.rpc);
          getWalletAccounts();
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
          getWalletAccounts();
          break;
        }
        case "imported-account": {
          dispatch(setEventMsg(eventData.data));
          getAccounts(selectedNetwork, selectedNetworkConfig.rpc);
          getWalletAccounts();
          break;
        }
        case "send-token-result": {
          dispatch(setEventMsg(eventData.data));
          displayWalletAccountBalance(walletAccount, walletNetConfig.rpc);
          break;
        }
        case "post-solidity-contracts": {
          dispatch(setSolidityContracts(eventData.data));
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
          displayAccountBalance(selectedAccount, selectedNetworkConfig.rpc);
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
            displayAccountBalance(selectedAccount, selectedNetworkConfig.rpc);
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
  }, [
    dispatch,
    selectedAccount,
    selectedNetwork,
    selectedNetworkConfig.rpc,
    walletAccount,
    walletNetConfig.rpc,
  ]);

  return (
    <>
      <Main>
        <Wrapper>
          <Routes>
            <Route path="/" element={<Execution />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/networksetting" element={<NetworkSettings />} />
          </Routes>
        </Wrapper>
        <SideBar />
        <ConsoleArea />
      </Main>
    </>
  );
}

export default App;
