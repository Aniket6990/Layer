import {
  VSCodeButton,
  VSCodeDropdown,
  VSCodeOption,
  VSCodeTextField,
} from "@vscode/webview-ui-toolkit/react";
import React, { useState } from "react";
import { FaRegCopy } from "react-icons/fa";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  createNewKeyPairAccount,
  getAccounts,
} from "../../configuration/webviewpostmsg";
import { setWalletAccount } from "../../store/extensionstore";

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
  const [password, setPassword] = useState("");
  const accounts = useAppSelector((state) => state.extension.addresses);
  const dispatch = useAppDispatch();

  const handleAccountDropdownChange = (event: any) => {
    dispatch(setWalletAccount(event.target.value));
  };
  return (
    <ConfigContainer>
      {/* Account selection dropdown */}
      <ConfigWrapper>
        <span>Account</span>
        <FullObjectWrapper>
          <DropDown
            onChange={(e: any) => {
              handleAccountDropdownChange(e);
            }}
          >
            <VSCodeOption>Select Account</VSCodeOption>
            {accounts.map((account, index) => {
              return (
                <VSCodeOption key={index} value={account}>
                  {account}
                </VSCodeOption>
              );
            })}
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
            <TextField
              placeholder="password"
              type="password"
              value={password}
              onChange={(e: any) => {
                setPassword(e.target.value);
              }}
            ></TextField>
            <VSCodeButton
              onClick={(e) => {
                createNewKeyPairAccount(password);
                getAccounts();
              }}
            >
              Create
            </VSCodeButton>
          </PartialObjectWrapper>
        </FullObjectWrapper>
      </ConfigWrapper>
    </ConfigContainer>
  );
};

export default WalletConfig;
