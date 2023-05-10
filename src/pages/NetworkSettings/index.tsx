import React from "react";
import styled from "styled-components";
import NetworkDetails from "./NetworkDetails";
import NetworkList from "./NetworkList";

const WalletContainer = styled.div`
  overflow-y: scroll;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-template-rows: repeat(1, 1fr);
`;

const Assessibilty = styled.div`
  height: auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  overflow-x: hidden;
  column-gap: 1.5rem;
`;
const ExecutionPage = () => {
  return (
    <WalletContainer>
      <Assessibilty>
        <NetworkList />
        <NetworkDetails />
      </Assessibilty>
    </WalletContainer>
  );
};

export default ExecutionPage;
