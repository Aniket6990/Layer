import React from "react";
import styled from "styled-components";
import ConfigArea from "./ConfigArea";
import ContractArea from "./ContractArea";

const Executioncontainer = styled.div`
  overflow-y: scroll;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-template-rows: repeat(1, 1fr);
`;

const Assessibilty = styled.div`
  height: auto;
  display: grid;
  grid-template-columns: 1fr 0.1fr 1fr;
  grid-template-rows: 1fr;
  overflow-x: hidden;
`;

const Divider = styled.div`
  height: 550px;
  width: 0;
  border: 0.5px solid var(--vscode-icon-foreground);
  justify-self: center;
  align-self: center;
`;

const ExecutionPage = () => {
  return (
    <Executioncontainer>
      <Assessibilty>
        <ConfigArea />
        <Divider></Divider>
        <ContractArea />
      </Assessibilty>
    </Executioncontainer>
  );
};

export default ExecutionPage;
