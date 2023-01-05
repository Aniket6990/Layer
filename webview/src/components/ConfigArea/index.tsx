import React from "react";
import {
  VSCodeButton,
  VSCodeDropdown,
  VSCodeOption,
  VSCodeTextField,
} from "@vscode/webview-ui-toolkit/react";
import "./index.css";
import { FaRegCopy } from "react-icons/fa";

const ConfigArea = () => {
  return (
    <div id="ConfigContainer">
      {/* dropdown for network selection */}
      <div id="network">
        <span>Network</span>
        <VSCodeDropdown className="dropdown">
          <VSCodeOption>Ethereum mainnet</VSCodeOption>
          <VSCodeOption>Ganache</VSCodeOption>
          <VSCodeOption>Hardhat</VSCodeOption>
          <VSCodeOption>Goerli testnet</VSCodeOption>
          <VSCodeOption>Polygon mainnet</VSCodeOption>
          <VSCodeOption>Polygon mumbai</VSCodeOption>
        </VSCodeDropdown>
      </div>
      {/* dropdown for account selection */}
      <div id="account">
        <span>Account</span>
        <div id="accountselection">
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
      {/* textfield for gas limit */}
      <div id="gaslimit">
        <span>Gas Limit</span>
        <div id="gasSelection">
          <VSCodeTextField
            placeholder="Gas limit"
            value={"3000000"}
            id="gasLimitTextField"
          ></VSCodeTextField>
          <FaRegCopy className="copyIcon" />
        </div>
      </div>
      {/* Area for Value in different units */}
      <div id="value">
        <span>Value</span>
        <div id="valueSelection">
          <VSCodeTextField
            placeholder="Gas limit"
            value={"0"}
            id="valueTextField"
          ></VSCodeTextField>
          <VSCodeDropdown id="valueDropDown">
            <VSCodeOption>Ether</VSCodeOption>
            <VSCodeOption>Gwei</VSCodeOption>
            <VSCodeOption>Wei</VSCodeOption>
          </VSCodeDropdown>
        </div>
      </div>
      {/* dropdown for selecting a compiled contract */}
      <div id="contract">
        <span>contract</span>
        <VSCodeDropdown className="dropdown">
          <VSCodeOption>Payment.sol</VSCodeOption>
          <VSCodeOption>SimpleAccount.sol</VSCodeOption>
        </VSCodeDropdown>
      </div>
      <div>OR</div>
      <div id="AtAddress">
        <div id="AtAddressSelection">
          <VSCodeButton id="AtAddressButton">At Address</VSCodeButton>
          <VSCodeTextField
            placeholder="deployed Address"
            value={""}
            id="AtAddressTextField"
          ></VSCodeTextField>
        </div>
      </div>
    </div>
  );
};

export default ConfigArea;
