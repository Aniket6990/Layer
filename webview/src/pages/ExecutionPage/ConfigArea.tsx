import React, { useCallback, useEffect, useMemo } from "react";
import {
  VSCodeButton,
  VSCodeDropdown,
  VSCodeOption,
  VSCodeTextField,
} from "@vscode/webview-ui-toolkit/react";
import styled from "styled-components";
import { FaRegCopy } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  setSelectedAccount,
  setSelectedNetwork,
  setSelectedNetworkConfig,
} from "../../store/extensionstore";
import { NetworkConfig } from "../../types";
import { displayAccountBalance } from "../../configuration/webviewpostmsg";

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
  const dispatch = useAppDispatch();
  const networks = useAppSelector((state) => state.extension.networks);
  const accounts = useAppSelector((state) => state.extension.addresses);
  const selectedAccount = useAppSelector(
    (state) => state.extension.selectedAccount
  );
  const selectedNetwork = useAppSelector(
    (state) => state.extension.selectedNetwork
  );
  const selectedNetConfig: NetworkConfig = useAppSelector(
    (state) => state.extension.selectedNetworkConfig
  );
  const configBalance = useAppSelector(
    (state) => state.extension.configBalance
  );

  useEffect(() => {
    if (
      selectedAccount !== "Select Account" &&
      selectedNetConfig.rpc !== undefined
    ) {
      displayAccountBalance(selectedAccount, selectedNetConfig.rpc);
    }
  }, [selectedAccount, selectedNetConfig]);

  const getSelectedConf = (selectedNetwork: string) => {
    const selectedNetworkConfig = networks[selectedNetwork];
    const parsedConfig: NetworkConfig = JSON.parse(selectedNetworkConfig);
    return parsedConfig;
  };

  const handleNetworkDropdownChange = (event: any) => {
    dispatch(setSelectedNetwork(event.target.value));
    const selectedNetworkConfig: NetworkConfig = getSelectedConf(
      event.target.value
    );
    dispatch(setSelectedNetworkConfig(selectedNetworkConfig));
  };

  const handleAccountDropdownChange = (event: any) => {
    dispatch(setSelectedAccount(event.target.value));
  };
  return (
    <ConfigContainer>
      {/* dropdown for network selection */}
      <ConfigWrapper>
        <span>Network</span>
        <DropDown
          value={selectedNetwork}
          onChange={(e: any) => {
            handleNetworkDropdownChange(e);
          }}
        >
          <VSCodeOption value="Select Network">Select Network</VSCodeOption>
          {Object.keys(networks).map((network, index) => {
            return (
              <VSCodeOption key={index} value={network}>
                {network}
              </VSCodeOption>
            );
          })}
        </DropDown>
      </ConfigWrapper>
      {/* dropdown for account selection */}
      <ConfigWrapper>
        <span>Account</span>
        <FullObjectWrapper>
          <DropDown
            value={selectedAccount}
            onChange={(e: any) => {
              handleAccountDropdownChange(e);
            }}
          >
            <VSCodeOption value="Select Account">Select Account</VSCodeOption>
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
      {/* selected account balance on selected network */}
      <ConfigWrapper>
        <span>Balance</span>
        <FullObjectWrapper>
          <GasLimitTextField
            placeholder="Balance"
            value={`${configBalance} ${
              selectedNetConfig.nativeCurrency !== undefined
                ? selectedNetConfig.nativeCurrency.symbol
                : ""
            }`}
            disabled
          ></GasLimitTextField>
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
