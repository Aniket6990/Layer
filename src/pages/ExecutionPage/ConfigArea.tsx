import React, { useEffect, useState } from "react";
import {
  VSCodeButton,
  VSCodeDropdown,
  VSCodeOption,
  VSCodeTextField,
} from "@vscode/webview-ui-toolkit/react";
import styled from "styled-components";
import { VscCheck, VscCopy, VscPassFilled, VscRefresh } from "react-icons/vsc";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  setExecValue,
  setGasLimit,
  setGlobalPswd,
  setSelectedAccount,
  setSelectedContract,
  setSelectedContractConstructor,
  setSelectedNetwork,
  setSelectedNetworkConfig,
} from "../../store/extensionstore";
import { NetworkConfig, TxInterface } from "../../types";
import {
  compileContract,
  deployContract,
  displayAccountBalance,
  listContractConstructor,
  loadAllContracts,
  loadSolidityContracts,
  unlockAccount,
} from "../../configuration/webviewpostmsg";
import ParameterInput from "../../components/UI/ParameterInput";
import { ethers } from "ethers";
import { getFileNameFromPath, isLocalNetwork } from "../../utilities/functions";
import ExtensionButton from "../../components/UI/Button";

const ConfigContainer = styled.div`
  height: 500px;
  overflow-y: scroll;
  border: 1px solid var(--vscode-icon-foreground);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 20px 0px 20px 20px;
  gap: 14px;
`;

const Header = styled.span`
  font-size: 14px;
  color: var(--vscode-icon-foreground);
  font-weight: 600;
  align-self: flex-start;
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

const GasLimitTextField = styled(VSCodeTextField)`
  font-size: 12px;
  border: 1px solid var(--vscode-icon-foreground);
`;

const ValueTextField = styled(GasLimitTextField)`
  font-size: 12px;
  border: 1px solid var(--vscode-icon-foreground);
`;

const ValueDropDown = styled(DropDown)`
  font-size: 12px;
`;

const CopyIcon = styled(VscCopy)`
  width: 18px;
  height: 18px;
  color: var(--vscode-icon-foreground);
  &:hover {
    cursor: pointer;
  }
`;

const RefreshIcon = styled(VscRefresh)`
  width: 18px;
  height: 18px;
  color: var(--vscode-icon-foreground);
  &:hover {
    cursor: pointer;
  }
`;

const CheckIcon = styled(VscPassFilled)`
  width: 18px;
  height: 18px;
  color: var(--vscode-icon-foreground);
  transition: "all 200ms ease-in-out";
  &:hover {
    cursor: pointer;
  }
`;

const CopyCheckIcon = styled(VscCheck)`
  width: 18px;
  height: 18px;
  color: var(--vscode-icon-foreground);
  transition: "all 200ms ease-in-out";
  &:hover {
    cursor: pointer;
  }
`;

const PasswordTextField = styled(VSCodeTextField)`
  font-size: 12px;
  border: 1px solid var(--vscode-icon-foreground);
  align-self: flex-start;
`;

const ConfigArea = () => {
  const dispatch = useAppDispatch();
  const [errorMsg, setErrorMsg] = useState<string | undefined>(undefined);
  const [value, setValue] = useState<string>("0");
  const [format, setFormat] = useState<string>("wei");
  const [selectedSolContract, setSelectedSolContract] =
    useState<string>("Select Contract");
  const [compilerVersion, setCompilerVersion] = useState<string>("0.8.19");
  const [copied, setCopied] = useState<boolean>(false);
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
  const solidityContracts = useAppSelector(
    (state) => state.extension.solidityContracts
  );
  const compilerVersions = useAppSelector(
    (state) => state.extension.compilerVersions
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
  const execValue = useAppSelector((state) => state.extension.execValue);

  const isAccountUnlocked = useAppSelector(
    (state) => state.extension.isAccountUnlocked
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
    /**
     * all contracts @parmas sould visible on account change if present.
     */
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

  const handleChangeInValue = (inValue: string) => {
    if (inValue === "" || parseInt(inValue) < 0) {
      setErrorMsg("value can't be less than zero.");
      return;
    }
    setErrorMsg(undefined);
    setValue(inValue);
    const changeValueFormat = ethers.utils.parseUnits(inValue, format);
    dispatch(setExecValue(changeValueFormat.toString()));
  };

  useEffect(() => {
    handleChangeInValue(value);
  }, [format]);

  const parameterCheck = (contractParams: string[]) => {
    if (selectedAccount === "Select Account") {
      return "No Account selected*";
    }
    if (globalPswd === "" && !isLocalNetwork(selectedNetwork)) {
      return "password is required*";
    }
    if (selectedNetConfig.rpc === undefined) {
      return "No Network selected*";
    }
    if (selectedContract === "Select Contract") {
      return "No solidity contract selected*";
    }
    if (
      selectedContractConstructor !== undefined &&
      contractParams.length !== selectedContractConstructor[0].inputs.length
    ) {
      return "Constructor parameter is missing*";
    }
    if (parseInt(gasLimit) < 210000) {
      return "Gas Limit should be more than 210000*";
    }
    return;
  };

  const handleDeployContract = (contractParams: string[]) => {
    const paramCheck = parameterCheck(contractParams);

    // Incase after changing the contract from dropdown the value in contract params not change.
    const params: string[] =
      selectedContractConstructor === undefined ? [] : contractParams;

    if (paramCheck !== undefined) {
      setErrorMsg(paramCheck);
    } else {
      setErrorMsg(undefined);
      deployContract(
        selectedContract,
        params,
        globalPswd,
        selectedNetwork,
        selectedAccount,
        selectedNetConfig.rpc,
        gasLimit,
        execValue
      );
    }
  };

  const handlePasswordCheck = () => {
    if (globalPswd === "") {
      setErrorMsg("Password is required.");
      return;
    }
    if (selectedAccount === "Select Account") {
      setErrorMsg("No Account selected.");
      return;
    }
    setErrorMsg(undefined);
    unlockAccount(selectedAccount, globalPswd);
  };

  const copyItem = async (item: string) => {
    await navigator.clipboard.writeText(item);
    setCopied(true);
  };

  const handleCompileContract = () => {
    if (
      selectedSolContract !== "Select Contract" &&
      selectedSolContract !== ""
    ) {
      compileContract(selectedSolContract, compilerVersion);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (copied) setCopied(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [copied]);

  return (
    <ConfigContainer>
      <Header>Environment setup</Header>
      {/* dropdown for network selection */}
      <ConfigWrapper>
        <span>Network</span>
        <FullObjectWrapper>
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
        </FullObjectWrapper>
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
            <VSCodeOption value="Select Account">
              {accounts.length === 0 ? "No Account" : "Select Account"}
            </VSCodeOption>
            {accounts.map((account, index) => {
              return (
                <VSCodeOption key={index} value={account}>
                  {account}
                </VSCodeOption>
              );
            })}
          </DropDown>
          {!copied ? (
            <CopyIcon
              onClick={(e) => {
                copyItem(selectedAccount);
              }}
            ></CopyIcon>
          ) : (
            <CopyCheckIcon></CopyCheckIcon>
          )}
        </FullObjectWrapper>
      </ConfigWrapper>
      {/* selected account balance on selected network */}
      <ConfigWrapper>
        <span>Balance</span>
        <FullObjectWrapper>
          <GasLimitTextField
            placeholder="Balance"
            value={`${configBalance} ${
              selectedNetwork !== "Select Network"
                ? selectedNetConfig.symbol
                : "ETH"
            }`}
            disabled
          ></GasLimitTextField>
          <RefreshIcon
            onClick={(e) => {
              if (
                selectedAccount !== "Select Account" &&
                selectedNetConfig.rpc !== undefined
              ) {
                displayAccountBalance(selectedAccount, selectedNetConfig.rpc);
              }
            }}
          ></RefreshIcon>
        </FullObjectWrapper>
      </ConfigWrapper>
      {/* textfield for gas limit */}
      <ConfigWrapper>
        <span>Gas Limit</span>
        <FullObjectWrapper>
          <GasLimitTextField
            type={"number"}
            step={18}
            placeholder="Gas limit"
            value={gasLimit}
            onChange={(e: any) => {
              const gaslimit = e.target.value;
              dispatch(setGasLimit(gaslimit.toString()));
            }}
          ></GasLimitTextField>
        </FullObjectWrapper>
      </ConfigWrapper>
      {/* Area for Value in different units */}
      <ConfigWrapper>
        <span>Value</span>
        <FullObjectWrapper>
          <PartialObjectWrapper>
            <ValueTextField
              type={"number"}
              step={18}
              placeholder="value"
              value={value}
              onChange={(e: any) => {
                const valuetoTransfer = e.target.value;
                handleChangeInValue(valuetoTransfer.toString());
              }}
            ></ValueTextField>
            <ValueDropDown
              value={format}
              onChange={(e: any) => setFormat(e.target.value)}
            >
              <VSCodeOption value="ether">Ether</VSCodeOption>
              <VSCodeOption value="gwei">Gwei</VSCodeOption>
              <VSCodeOption value="wei" selected={true}>
                Wei
              </VSCodeOption>
            </ValueDropDown>
          </PartialObjectWrapper>
        </FullObjectWrapper>
      </ConfigWrapper>
      {/* dropdown for selecting a compiled contract */}
      <ConfigWrapper>
        <span>Solidity contract</span>
        <FullObjectWrapper>
          <DropDown
            value={selectedSolContract}
            onChange={(e: any) => {
              setSelectedSolContract(e.target.value);
            }}
          >
            <VSCodeOption value="Select Contract">
              {solidityContracts.length === 0
                ? "No Contract"
                : "Select Contract"}
            </VSCodeOption>
            {solidityContracts.map((contract, index) => {
              return (
                <VSCodeOption key={index} value={contract}>
                  {getFileNameFromPath(contract)}
                </VSCodeOption>
              );
            })}
          </DropDown>
          <RefreshIcon
            onClick={(e) => {
              loadSolidityContracts();
            }}
          ></RefreshIcon>
        </FullObjectWrapper>
      </ConfigWrapper>
      <ConfigWrapper>
        <span>Compiler version</span>
        <FullObjectWrapper>
          <DropDown
            value={compilerVersion}
            onChange={(e: any) => {
              setCompilerVersion(e.target.value);
            }}
          >
            {compilerVersions.map((compiler, index) => {
              return (
                <VSCodeOption key={index} value={compiler}>
                  {compiler}
                </VSCodeOption>
              );
            })}
          </DropDown>
        </FullObjectWrapper>
      </ConfigWrapper>
      <ConfigWrapper>
        <FullObjectWrapper>
          <ExtensionButton
            onClick={(e: any) => {
              handleCompileContract();
            }}
            title="Compile"
          >
            Compile
          </ExtensionButton>
        </FullObjectWrapper>
      </ConfigWrapper>
      {/* dropdown for selecting a compiled contract */}
      <ConfigWrapper>
        <span>Compiled contract</span>
        <FullObjectWrapper>
          <DropDown
            value={selectedContract}
            onChange={(e: any) => {
              dispatch(setSelectedContract(e.target.value));
            }}
          >
            <VSCodeOption value="Select Contract">
              Select Contract to deploy
            </VSCodeOption>
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
      <ConfigWrapper>
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
      </ConfigWrapper>
      {/* show password input field when @globalPswd is empty */}
      {selectedAccount !== "Select Account" &&
      isAccountUnlocked === false &&
      !isLocalNetwork(selectedNetwork) ? (
        <ConfigWrapper>
          <span>Unlock Account</span>
          <FullObjectWrapper>
            <PasswordTextField
              onKeyPress={(e: any) => {
                if (e.key === "Enter") {
                  unlockAccount(selectedAccount, globalPswd);
                }
              }}
              placeholder="password"
              value={globalPswd}
              onChange={(e: any) => {
                dispatch(setGlobalPswd(e.target.value));
              }}
              type="password"
            ></PasswordTextField>
            <CheckIcon
              onClick={(e) => {
                handlePasswordCheck();
              }}
            ></CheckIcon>
          </FullObjectWrapper>
        </ConfigWrapper>
      ) : null}
      {errorMsg !== undefined && (
        <span style={{ alignSelf: "flex-start", color: "red" }}>
          {errorMsg}
        </span>
      )}
    </ConfigContainer>
  );
};

export default ConfigArea;
