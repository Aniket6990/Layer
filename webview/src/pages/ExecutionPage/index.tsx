import React from "react";
import styled from "styled-components";
import ConfigArea from "../../components/ConfigArea";
import ConsoleArea from "../../components/ConsoleArea";
import ContractArea from "../../components/ContractArea";

const Executioncontainer = styled.div`
  width: 100%;
  overflow-y: scroll;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-template-rows: 1fr 0.3fr;
  padding: 20px;
  row-gap: 20px;
`;

const Assessibilty = styled.div`
  height: auto;
  display: grid;
  grid-template-columns: 1fr 0.1fr 1fr 0.2fr;
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
      <ConsoleArea />
    </Executioncontainer>
  );
};

export default ExecutionPage;
