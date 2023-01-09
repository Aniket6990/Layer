import {
  VSCodeButton,
  VSCodeDropdown,
  VSCodeOption,
  VSCodeTextField,
} from "@vscode/webview-ui-toolkit/react";
import React from "react";
import { FaRegCopy } from "react-icons/fa";
import styled from "styled-components";
import { useAppSelector } from "../../app/hooks";

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

const SemiWrapper = styled.div`
  width: 90%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  column-gap: 10px;
`;

const TextField = styled(VSCodeTextField)`
  width: 100%;
  font-size: 12px;
  border: 1px solid var(--vscode-icon-foreground);
`;

const ErrorMessage = styled.span`
  color: red;
  font-size: 12px;
  justify-self: center;
`;

const WalletTransaction = () => {
  const networks = useAppSelector((state) => state.extension.networks);
  return (
    <ConfigContainer>
      {/* Network selection field */}
      <ConfigWrapper>
        <span>Network</span>
        <FullObjectWrapper>
          <DropDown>
            <VSCodeOption>Select Network</VSCodeOption>
            {Object.keys(networks).map((network, index) => {
              return (
                <VSCodeOption key={index} value={network}>
                  {network}
                </VSCodeOption>
              );
            })}
          </DropDown>
        </FullObjectWrapper>
      </ConfigWrapper>
      {/* Show balance filed */}
      <ConfigWrapper>
        <span>Balance</span>
        <FullObjectWrapper>
          <TextField value="100.022020303" disabled></TextField>
        </FullObjectWrapper>
      </ConfigWrapper>
      {/* Transaction menu area */}
      <ConfigWrapper>
        <span>Transaction</span>
        <SemiWrapper>
          <VSCodeButton>Send</VSCodeButton>
          <VSCodeButton>Receive</VSCodeButton>
        </SemiWrapper>
      </ConfigWrapper>
      {/* Recipient textfield area */}
      <ConfigWrapper>
        <span>Recipient Address</span>
        <FullObjectWrapper>
          <TextField placeholder="0x53..."></TextField>
        </FullObjectWrapper>
      </ConfigWrapper>
      {/* Transaction amount and gaslimit area */}
      <ConfigWrapper>
        <SemiWrapper>
          <ConfigWrapper>
            <span>Amount</span>
            <TextField placeholder="1"></TextField>
          </ConfigWrapper>
          <ConfigWrapper>
            <span>Gas Limit</span>
            <TextField value="21000"></TextField>
          </ConfigWrapper>
        </SemiWrapper>
      </ConfigWrapper>
      {/* send transaction button */}
      <ConfigWrapper>
        <ErrorMessage>Transaction Error message</ErrorMessage>
        <VSCodeButton>Send</VSCodeButton>
      </ConfigWrapper>
    </ConfigContainer>
  );
};

export default WalletTransaction;
