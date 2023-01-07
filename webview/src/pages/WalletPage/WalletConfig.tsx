import {
  VSCodeButton,
  VSCodeDropdown,
  VSCodeOption,
  VSCodeTextField,
} from "@vscode/webview-ui-toolkit/react";
import React from "react";
import { FaRegCopy } from "react-icons/fa";
import styled from "styled-components";

const ConfigContainer = styled.div`
  height: 500px;
  overflow-y: scroll;
  border-radius: 10px;
  border: 1px solid var(--vscode-icon-foreground);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 20px 0px 20px 20px;
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
  font-size: 12px;
  border: 1px solid var(--vscode-icon-foreground);
`;

const FullObjectWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 0.1fr;
  grid-template-rows: 1fr;
  column-gap: 10px;
  align-items: center;
`;

const PartialObjectWrapper = styled.div`
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  grid-template-rows: 1fr;
  column-gap: 10px;
`;

const TextField = styled(VSCodeTextField)`
  font-size: 12px;
  border: 1px solid var(--vscode-icon-foreground);
`;

const CopyIcon = styled(FaRegCopy)`
  width: 16px;
  height: 16px;
`;

const WalletConfig = () => {
  return (
    <ConfigContainer>
      {/* Account selection dropdown */}
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
      {/* Import account field */}
      <ConfigWrapper>
        <span>Import Account</span>
        <FullObjectWrapper>
          <PartialObjectWrapper>
            <TextField placeholder="Private Key"></TextField>
            <TextField placeholder="Password"></TextField>
          </PartialObjectWrapper>
          <CopyIcon></CopyIcon>
        </FullObjectWrapper>
        <span>OR</span>
        <FullObjectWrapper>
          <VSCodeButton>From JSON</VSCodeButton>
        </FullObjectWrapper>
      </ConfigWrapper>
      {/* Export account field */}
      <ConfigWrapper>
        <span>Export Account</span>
        <FullObjectWrapper>
          <PartialObjectWrapper>
            <TextField placeholder="******************"></TextField>
            <TextField placeholder="Password"></TextField>
          </PartialObjectWrapper>
          <CopyIcon></CopyIcon>
        </FullObjectWrapper>
        <span>OR</span>
        <FullObjectWrapper>
          <VSCodeButton>Export JSON</VSCodeButton>
        </FullObjectWrapper>
      </ConfigWrapper>
      {/* Create new account field */}
      <ConfigWrapper>
        <span>Create account</span>
        <FullObjectWrapper>
          <PartialObjectWrapper>
            <TextField placeholder="password"></TextField>
            <VSCodeButton>Create</VSCodeButton>
          </PartialObjectWrapper>
        </FullObjectWrapper>
      </ConfigWrapper>
    </ConfigContainer>
  );
};

export default WalletConfig;
