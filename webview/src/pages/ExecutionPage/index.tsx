import React from "react";
import { VSCodeDivider } from "@vscode/webview-ui-toolkit/react";
import ConfigArea from "../../components/ConfigArea";
import ContractArea from "../../components/ContractArea";
import "./index.css";

const ExecutionPage = () => {
  return (
    <div id="Executioncontainer">
      <div id="Assessibilty">
        <ConfigArea />
        <div id="divider"></div>
        <ContractArea />
      </div>
    </div>
  );
};

export default ExecutionPage;
