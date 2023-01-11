import styled from "styled-components";
import { Routes, Route } from "react-router-dom";
import ConsoleArea from "./components/ConsoleArea";
import SideBar from "./components/SideBar";
import ExecutionPage from "./pages/ExecutionPage";
import WalletPage from "./pages/WalletPage";
import { withRouter } from "./utilities/withRouter";
import { getAccounts, getNetworks } from "./configuration/webviewpostmsg";
import { useEffect } from "react";
import { useAppDispatch } from "./app/hooks";
import {
  setNetworks,
  setAccounts,
  setConfigBalance,
  setWalletAccountBalance,
} from "./store/extensionstore";

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

  useEffect(() => {
    getNetworks();
    getAccounts();
  }, []);

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
          console.log(`new account created: ${eventData.data}`);
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
          console.log(`new account created from pvt key: ${eventData.data}`);
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
  }, [dispatch]);

  return (
    <Main>
      <Wrapper>
        <Routes>
          <Route path="/" element={<Execution />} />
          <Route path="/wallet" element={<Wallet />} />
        </Routes>
        <ConsoleArea />
      </Wrapper>
      <SideBar />
    </Main>
  );
}

export default App;
