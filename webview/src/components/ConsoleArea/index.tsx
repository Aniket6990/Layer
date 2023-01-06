import React from "react";
import styled from "styled-components";

const ConsoleContainer = styled.div`
  width: 100%;
  height: 100%;
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
  return (
    <ConsoleContainer>
      <span>Events Console</span>
    </ConsoleContainer>
  );
};

export default ConsoleArea;
