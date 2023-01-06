import React from "react";
import { IoWalletOutline, IoSettingsOutline } from "react-icons/io5";
import styled from "styled-components";

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
`;

const WalletIcon = styled(IoWalletOutline)`
  width: 18px;
  height: 18px;
`;

const SettingsIcon = styled(IoSettingsOutline)`
  width: 18px;
  height: 18px;
`;

const SideBar = () => {
  return (
    <MenuContainer>
      <WalletIcon></WalletIcon>
      <SettingsIcon></SettingsIcon>
    </MenuContainer>
  );
};

export default SideBar;
