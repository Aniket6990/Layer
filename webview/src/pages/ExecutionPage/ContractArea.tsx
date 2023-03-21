import React, { useEffect, useState } from "react";
import { VSCodeDropdown, VSCodeOption } from "@vscode/webview-ui-toolkit/react";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  executeContractFunction,
  getDeployedContracts,
  listContractFunctions,
} from "../../configuration/webviewpostmsg";
import ParameterInput from "../../components/UI/ParameterInput";
import { FunctionObjectType, NetworkConfig } from "../../types";
import { VscCheck, VscCopy } from "react-icons/vsc";
import { isLocalNetwork } from "../../utilities/functions";
import { setSelectedContractFunctions } from "../../store/extensionstore";

const ContractContainer = styled.div`
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

const DeployedContract = styled.div`
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

const ContractSelection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const DropDown = styled(VSCodeDropdown)`
  width: 90%;
  font-size: 12px;
  border: 1px solid var(--vscode-icon-foreground);
`;

const ContractCall = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 14px;
  font-size: 12px;
  color: var(--vscode-icon-foreground);
  font-weight: 600;
  width: 100%;
  height: 100%;
`;

const CopyIcon = styled(VscCopy)`
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

const ContractArea = () => {
  const dispatch = useAppDispatch();
  const [selectDeployedContract, setSelectDeployedContract] =
    useState<string>("Select Contract");
  const [selectedContractName, setSelectedContractName] = useState<string>();
  const [selectedContractAddress, setSelectContractAddress] =
    useState<string>();
  const [errorMsg, setErrorMsg] = useState<string | undefined>(undefined);
  const [copied, setCopied] = useState<boolean>(false);
  const selectedNetwork = useAppSelector(
    (state) => state.extension.selectedNetwork
  );
  const deployedContracts = useAppSelector(
    (state) => state.extension.deployedContracts
  );
  const selectedContractFunctions = useAppSelector(
    (state) => state.extension.selectedContractFunctions
  );
  const selectedNetConfig: NetworkConfig = useAppSelector(
    (state) => state.extension.selectedNetworkConfig
  );
  const selectedAccount = useAppSelector(
    (state) => state.extension.selectedAccount
  );
  const globalPswd = useAppSelector((state) => state.extension.globalPswd);

  const execValue = useAppSelector((state) => state.extension.execValue);

  const gasLimit = useAppSelector((state) => state.extension.gasLimit);
  useEffect(() => {
    if (selectedNetwork !== "Select Network") {
      getDeployedContracts(selectedNetwork);
      setSelectDeployedContract("Select Contract");
    }
  }, [selectedNetwork]);

  const handleSelectContract = (event: any) => {
    const eventValue: string = event.target.value;
    setSelectDeployedContract(event.target.value);
    const contractData: string[] = eventValue.split(":");
    setSelectedContractName(contractData[0]);
    setSelectContractAddress(contractData[1]);
    listContractFunctions(contractData[0]);
  };

  useEffect(() => {
    dispatch(setSelectedContractFunctions(undefined));
  }, [selectedNetwork]);

  const parameterCheck = (
    contractParams: string[],
    functionObject: FunctionObjectType
  ) => {
    if (selectedAccount === "Select Account") {
      return "No Account selected*";
    }
    if (globalPswd === "" && !isLocalNetwork(selectedNetwork)) {
      return "password is required*";
    }
    if (selectedNetConfig.rpc === undefined) {
      return "No Network selected*";
    }
    if (
      functionObject.inputs.length !== 0 &&
      contractParams.length !== functionObject.inputs.length
    ) {
      return "function parameter is missing*";
    }
    if (selectedContractName === undefined) {
      return "No contract selected*";
    }
    if (parseInt(gasLimit) < 210000) {
      return "Gas Limit should be more than 210000*";
    }
    return;
  };

  const handleExecuteContract = (
    contractParams: string[],
    functionObject: FunctionObjectType
  ) => {
    const paramCheck = parameterCheck(contractParams, functionObject);
    if (paramCheck !== undefined) {
      setErrorMsg(paramCheck);
    } else {
      setErrorMsg(undefined);
      executeContractFunction(
        selectedContractName as string,
        selectedContractAddress as string,
        functionObject,
        contractParams,
        globalPswd,
        selectedAccount,
        selectedNetwork,
        selectedNetConfig.rpc,
        gasLimit,
        execValue
      );
    }
  };

  const copyItem = async (item: string) => {
    await navigator.clipboard.writeText(item);
    setCopied(true);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (copied) setCopied(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [copied]);

  return (
    <ContractContainer>
      {/* dropdown for account selection */}
      <DeployedContract>
        <span>Deployed Contracts</span>
        <ContractSelection>
          <DropDown
            value={selectDeployedContract}
            onChange={(e: any) => {
              handleSelectContract(e);
            }}
          >
            <VSCodeOption value="Select Contract">Select Contract</VSCodeOption>
            {deployedContracts.map((contractData, index) => {
              return (
                contractData !== null && (
                  <VSCodeOption
                    key={index}
                    value={`${contractData.contractName}:${contractData.address}`}
                  >
                    {`${
                      contractData.contractName
                    }: ${contractData.address.slice(
                      0,
                      15
                    )}...${contractData.address.slice(-13)}`}
                  </VSCodeOption>
                )
              );
            })}
          </DropDown>
          {!copied ? (
            <CopyIcon
              onClick={(e) => {
                copyItem(selectedContractAddress as string);
              }}
            ></CopyIcon>
          ) : (
            <CopyCheckIcon></CopyCheckIcon>
          )}
        </ContractSelection>
      </DeployedContract>
      {/* Area for contract call */}
      <ContractCall>
        {errorMsg !== undefined && (
          <span style={{ alignSelf: "flex-start", color: "red" }}>
            {errorMsg}
          </span>
        )}
        {selectedContractFunctions !== undefined &&
          selectedContractFunctions.map((func: any, index: any) => {
            return (
              <ParameterInput
                key={index}
                title={func.name}
                buttonSize={1}
                inputSize={3}
                functionObject={func}
                functionToCall={handleExecuteContract}
              >
                {func.name}
              </ParameterInput>
            );
          })}
      </ContractCall>
    </ContractContainer>
  );
};

export default ContractArea;
