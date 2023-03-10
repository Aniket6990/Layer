import React, { useEffect, useState } from "react";
import {
  VSCodeButton,
  VSCodeDropdown,
  VSCodeOption,
  VSCodeTextField,
} from "@vscode/webview-ui-toolkit/react";
import styled from "styled-components";
import { FaRegCopy } from "react-icons/fa";
import { VscRefresh } from "react-icons/vsc";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  setGasLimit,
  setGlobalPswd,
  setSelectedAccount,
  setSelectedContract,
  setSelectedNetwork,
  setSelectedNetworkConfig,
} from "../../store/extensionstore";
import { NetworkConfig, TxInterface } from "../../types";
import {
  deployContract,
  displayAccountBalance,
  listContractConstructor,
  loadAllContracts,
} from "../../configuration/webviewpostmsg";
import ParameterInput from "../../components/UI/ParameterInput";

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
  gap: 14px;
`;

const ConfigWrapper = styled.div`
  font-size: 12px;
  color: var(--vscode-icon-foreground);
  font-weight: 600;
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
  color: var(--vscode-icon-foreground);
  &:hover {
    cursor: pointer;
  }
`;

const RefreshIcon = styled(VscRefresh)`
  width: 16px;
  height: 16px;
  color: var(--vscode-icon-foreground);
  &:hover {
    cursor: pointer;
  }
`;

const PasswordTextField = styled(VSCodeTextField)`
  width: 90%;
  font-size: 12px;
  border: 1px solid var(--vscode-icon-foreground);
  align-self: flex-start;
`;

const ConfigArea = () => {
  const dispatch = useAppDispatch();
  const [pswd, setPswd] = useState<string>();
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
  const compiledContracts = useAppSelector(
    (state) => state.extension.compiledContracts
  );

  const selectedContract = useAppSelector(
    (state) => state.extension.selectedContract
  );

  const gasLimit = useAppSelector((state) => state.extension.gasLimit);

  const globalPswd = useAppSelector((state) => state.extension.globalPswd);

  const selectedContractConstructor = useAppSelector(
    (state) => state.extension.selectedContractConstructor
  );
  useEffect(() => {
    if (
      selectedAccount !== "Select Account" &&
      selectedNetConfig.rpc !== undefined
    ) {
      displayAccountBalance(selectedAccount, selectedNetConfig.rpc);
    }
  }, [selectedAccount, selectedNetConfig]);

  // list all constructor parameters
  useEffect(() => {
    if (selectedContract !== "Select Contract") {
      listContractConstructor(selectedContract);
    }
  }, [selectedContract]);

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

  const handleDeployContract = (contractParams: string[]) => {
    if (
      selectedAccount !== "Select Account" &&
      globalPswd !== "" &&
      selectedNetConfig.rpc !== undefined &&
      selectedContract !== "Select Contract"
    ) {
      deployContract(
        selectedContract,
        contractParams,
        globalPswd,
        selectedNetwork,
        selectedAccount,
        selectedNetConfig.rpc
      );
      dispatch(setGlobalPswd(""));
    }
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
              selectedNetConfig !== undefined ? selectedNetConfig.symbol : ""
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
            value={gasLimit}
            onChange={(e: any) => {
              dispatch(setGasLimit(e.target.value));
            }}
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
        <FullObjectWrapper>
          <DropDown
            value={selectedContract}
            onChange={(e: any) => {
              dispatch(setSelectedContract(e.target.value));
            }}
          >
            <VSCodeOption value="Select Contract">Select Contract</VSCodeOption>
            {compiledContracts.map((contract, index) => {
              return (
                <VSCodeOption key={index} value={contract}>
                  {`${contract}.sol`}
                </VSCodeOption>
              );
            })}
          </DropDown>
          <RefreshIcon
            onClick={(e) => {
              loadAllContracts();
            }}
          ></RefreshIcon>
        </FullObjectWrapper>
      </ConfigWrapper>
      <span style={{ alignSelf: "center", paddingRight: "10%" }}>OR</span>
      <ConfigWrapper>
        <PartialObjectWrapper>
          <AtAddressButton>At Address</AtAddressButton>
          <AtAddressTextField
            placeholder="deployed Address"
            value={""}
          ></AtAddressTextField>
        </PartialObjectWrapper>
      </ConfigWrapper>
      {selectedContractConstructor !== undefined ? (
        <ParameterInput
          title="Deploy"
          buttonSize={1}
          inputSize={3}
          functionObject={selectedContractConstructor[0]}
          functionToCall={handleDeployContract}
        >
          Deploy
        </ParameterInput>
      ) : (
        <ParameterInput
          title="Deploy"
          buttonSize={1}
          functionToCall={handleDeployContract}
        >
          Deploy
        </ParameterInput>
      )}

      <ConfigWrapper>
        <span>Password</span>
        <PasswordTextField
          placeholder="password"
          value={globalPswd}
          onChange={(e: any) => dispatch(setGlobalPswd(e.target.value))}
          type="password"
        ></PasswordTextField>
      </ConfigWrapper>
    </ConfigContainer>
  );
};

export default ConfigArea;
