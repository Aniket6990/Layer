import React from "react";
import { VSCodeDropdown, VSCodeOption } from "@vscode/webview-ui-toolkit/react";
import styled from "styled-components";
import { FaRegCopy } from "react-icons/fa";

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
  return (
    <ContractContainer>
      {/* dropdown for account selection */}
      <DeployedContract>
        <span>Deployed Contracts</span>
        <ContractSelection>
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
