// import { vscode } from "./utilities/vscode";
import "./App.css";
import ExecutionPage from "./pages/ExecutionPage";

function App() {
  // function handleHowdyClick() {
  //   vscode.postMessage({
  //     command: "hello",
  //     text: "Hey there partner! 🤠",
  //   });
  // }

  return (
    <main>
      {/* <VSCodeButton onClick={handleHowdyClick}>Howdy!</VSCodeButton> */}
      <ExecutionPage />
    </main>
  );
}

export default App;
