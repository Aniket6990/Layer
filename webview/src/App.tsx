// import { vscode } from "./utilities/vscode";
import styled from "styled-components";
import ConsoleArea from "./components/ConsoleArea";
import SideBar from "./components/SideBar";
import ExecutionPage from "./pages/ExecutionPage";
import WalletPage from "./pages/WalletPage";

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
  // function handleHowdyClick() {
  //   vscode.postMessage({
  //     command: "hello",
  //     text: "Hey there partner! 🤠",
  //   });
  // }

  return (
    <Main>
      <Wrapper>
        {/* <ExecutionPage /> */}
        <WalletPage />
        <ConsoleArea />
      </Wrapper>
      <SideBar />
    </Main>
  );
}

export default App;
