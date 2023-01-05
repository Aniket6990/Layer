import React from "react";
import {
  VSCodeButton,
  VSCodeDropdown,
  VSCodeOption,
  VSCodeTextField,
} from "@vscode/webview-ui-toolkit/react";
import "./index.css";
import { FaRegCopy } from "react-icons/fa";

const ContractArea = () => {
  return (
    <div id="ContractContainer">
      {/* dropdown for account selection */}
      <div id="deployedContract">
        <span>Deployed Contracts</span>
        <div id="contractSelection">
          <VSCodeDropdown className="dropdown">
            <VSCodeOption>
              0x53871197A0a417F1ab30D64dBd62f72E64D91CA5
            </VSCodeOption>
            <VSCodeOption>
              0xbee5a6b9d30ACdC31F4ad2D2b34BdF0e5a8C4B1d
            </VSCodeOption>
            <VSCodeOption>
              0x40a231a98c960aFA02F9B0162a80E1553443a4a0
            </VSCodeOption>
            <VSCodeOption>
              0x1CA25E2c0A6d64F437c64e1A7B372382f338F5B6
            </VSCodeOption>
          </VSCodeDropdown>
          <FaRegCopy className="copyIcon" />
        </div>
      </div>
      {/* Area for contract call */}
      <div id="contractCall">
        <span>Contract Call</span>
        <div id="functionArea">
          <span>No Contract selected</span>
        </div>
      </div>
    </div>
  );
};

export default ContractArea;
