import React from "react";
import styled from "styled-components";
import { useAppSelector } from "../../app/hooks";

const ConsoleContainer = styled.div`
  overflow-y: scroll;
  border: 1px solid var(--vscode-icon-foreground);
  border-radius: 10px;
  padding: 20px;
  color: var(--vscode-icon-foreground);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

const ConsoleArea = () => {
  const selectedNetwork = useAppSelector(
    (state) => state.extension.selectedNetwork
  );
  const selectedNetworkConfig = useAppSelector(
    (state) => state.extension.selectedNetworkConfig
  );
  const selectedAccount = useAppSelector(
    (state) => state.extension.selectedAccount
  );
  return (
    <ConsoleContainer>
      <span>Events Console</span>
      <span>
        {selectedNetwork !== undefined
          ? `selected network is ${selectedNetwork}`
          : null}
      </span>
      <span>
        {selectedNetworkConfig !== undefined
          ? `selected network config: ${selectedNetworkConfig}`
          : null}
      </span>
      <span>
        {selectedAccount !== undefined
          ? `selected Account: ${selectedAccount}`
          : null}
      </span>
    </ConsoleContainer>
  );
};

export default ConsoleArea;
