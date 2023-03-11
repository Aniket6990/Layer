import React, { useEffect, useState } from "react";
import { VSCodeDropdown, VSCodeOption } from "@vscode/webview-ui-toolkit/react";
import styled from "styled-components";
import { FaRegCopy } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  deployContract,
  executeContractFunction,
  getDeployedContracts,
  listContractFunctions,
} from "../../configuration/webviewpostmsg";
import ParameterInput from "../../components/UI/ParameterInput";
import { FunctionObjectType, NetworkConfig } from "../../types";
import { setGlobalPswd } from "../../store/extensionstore";

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

const FunctionArea = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CopyIcon = styled(FaRegCopy)`
  width: 16px;
  height: 16px;
`;

const ContractArea = () => {
  const dispatch = useAppDispatch();
  const [selectDeployedContract, setSelectDeployedContract] =
    useState<string>("Select Contract");
  const [selectedContractName, setSelectedContractName] = useState<string>();
  const [selectedContractAddress, setSelectContractAddress] =
    useState<string>();
  const [errorMsg, setErrorMsg] = useState<string | undefined>(undefined);
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

  const parameterCheck = (
    contractParams: string[],
    functionObject: FunctionObjectType
  ) => {
    if (selectedAccount === "Select Account") {
      return "No Account selected*";
    }
    if (globalPswd === "") {
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
          <CopyIcon
            onClick={(e: any) => {
              if (selectedNetwork !== "Select Network") {
                getDeployedContracts(selectedNetwork);
              }
            }}
          ></CopyIcon>
        </ContractSelection>
      </DeployedContract>
      {/* Area for contract call */}
      <ContractCall>
        <span>
          {selectedContractName !== undefined &&
          selectedContractAddress !== undefined
            ? `${selectedContractName}: ${selectedContractAddress}`
            : `Contract call`}
        </span>
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
