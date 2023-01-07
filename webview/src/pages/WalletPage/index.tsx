import React from "react";
import styled from "styled-components";
import WalletConfig from "./WalletConfig";
import WalletTransaction from "./WalletTransaction";

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

const WalletPage = () => {
  return (
    <WalletContainer>
      <Assessibilty>
        <WalletConfig />
        <WalletTransaction />
      </Assessibilty>
    </WalletContainer>
  );
};

export default WalletPage;
