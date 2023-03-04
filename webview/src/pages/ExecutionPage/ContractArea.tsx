import React, { useEffect, useState } from "react";
import { VSCodeDropdown, VSCodeOption } from "@vscode/webview-ui-toolkit/react";
import styled from "styled-components";
import { FaRegCopy } from "react-icons/fa";
import { useAppSelector } from "../../app/hooks";
import { getDeployedContracts } from "../../configuration/webviewpostmsg";

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
  const [selectDeployedContract, setSelectDeployedContract] =
    useState<string>("Select Contract");
  const selectedNetwork = useAppSelector(
    (state) => state.extension.selectedNetwork
  );
  const deployedContracts = useAppSelector(
    (state) => state.extension.deployedContracts
  );

  useEffect(() => {
    if (selectedNetwork !== "Select Network") {
      getDeployedContracts(selectedNetwork);
      setSelectDeployedContract("Select Contract");
    }
  }, [selectedNetwork]);

  const handleSelectContract = (event: any) => {
    setSelectDeployedContract(event.target.value);
    console.log(`selected contract: ${event.target.value}`);
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
                  <VSCodeOption key={index} value={contractData.contractName}>
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
          <CopyIcon></CopyIcon>
        </ContractSelection>
      </DeployedContract>
      {/* Area for contract call */}
      <ContractCall>
        <span>Contract Call</span>
        <FunctionArea>
          <span>No Contract selected</span>
        </FunctionArea>
      </ContractCall>
    </ContractContainer>
  );
};

export default ContractArea;
