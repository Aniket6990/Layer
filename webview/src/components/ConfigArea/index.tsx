import React from "react";
import {
  VSCodeButton,
  VSCodeDropdown,
  VSCodeOption,
  VSCodeTextField,
} from "@vscode/webview-ui-toolkit/react";
import styled from "styled-components";
import { FaRegCopy } from "react-icons/fa";

const ConfigContainer = styled.div`
  height: 600px;
  overflow-y: scroll;
  border: 1px solid var(--vscode-icon-foreground);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 20px;
  gap: 8px;
`;

const ConfigWrapper = styled.div`
  font-size: 12px;
  color: var(--vscode-icon-foreground);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  gap: 8px;
`;

const DropDown = styled(VSCodeDropdown)`
  width: 90%;
  font-size: 12px;
  border: 1px solid var(--vscode-icon-foreground);
`;

const FullObjectWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const PartialObjectWrapper = styled.div`
  width: 90%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const GasLimitTextField = styled(VSCodeTextField)`
  width: 90%;
  font-size: 12px;
  border: 1px solid var(--vscode-icon-foreground);
`;

const ValueTextField = styled(GasLimitTextField)`
  width: 60%;
`;

const AtAddressTextField = styled(GasLimitTextField)`
  width: 60%;
`;

const ValueDropDown = styled(DropDown)`
  width: 35%;
`;

const AtAddressButton = styled(VSCodeButton)`
  width: 35%;
`;

const CopyIcon = styled(FaRegCopy)`
  width: 16px;
  height: 16px;
`;
const ConfigArea = () => {
  return (
    <ConfigContainer>
      {/* dropdown for network selection */}
      <ConfigWrapper>
        <span>Network</span>
        <DropDown>
          <VSCodeOption>Ethereum mainnet</VSCodeOption>
          <VSCodeOption>Ganache</VSCodeOption>
          <VSCodeOption>Hardhat</VSCodeOption>
          <VSCodeOption>Goerli testnet</VSCodeOption>
          <VSCodeOption>Polygon mainnet</VSCodeOption>
          <VSCodeOption>Polygon mumbai</VSCodeOption>
        </DropDown>
      </ConfigWrapper>
      {/* dropdown for account selection */}
      <ConfigWrapper>
        <span>Account</span>
        <FullObjectWrapper>
          <DropDown>
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
          </DropDown>
          <CopyIcon></CopyIcon>
        </FullObjectWrapper>
      </ConfigWrapper>
      {/* textfield for gas limit */}
      <ConfigWrapper>
        <span>Gas Limit</span>
        <FullObjectWrapper>
          <GasLimitTextField
            placeholder="Gas limit"
            value={"3000000"}
          ></GasLimitTextField>
          <CopyIcon></CopyIcon>
        </FullObjectWrapper>
      </ConfigWrapper>
      {/* Area for Value in different units */}
      <ConfigWrapper>
        <span>Value</span>
        <PartialObjectWrapper>
          <ValueTextField placeholder="Gas limit" value={"0"}></ValueTextField>
          <ValueDropDown>
            <VSCodeOption>Ether</VSCodeOption>
            <VSCodeOption>Gwei</VSCodeOption>
            <VSCodeOption>Wei</VSCodeOption>
          </ValueDropDown>
        </PartialObjectWrapper>
      </ConfigWrapper>
      {/* dropdown for selecting a compiled contract */}
      <ConfigWrapper>
        <span>contract</span>
        <DropDown>
          <VSCodeOption>Payment.sol</VSCodeOption>
          <VSCodeOption>SimpleAccount.sol</VSCodeOption>
        </DropDown>
      </ConfigWrapper>
      <div>OR</div>
      <ConfigWrapper>
        <PartialObjectWrapper>
          <AtAddressButton>At Address</AtAddressButton>
          <AtAddressTextField
            placeholder="deployed Address"
            value={""}
          ></AtAddressTextField>
        </PartialObjectWrapper>
      </ConfigWrapper>
    </ConfigContainer>
  );
};

export default ConfigArea;
