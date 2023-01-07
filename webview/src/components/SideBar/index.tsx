import React from "react";
import { useNavigate } from "react-router-dom";
import { IoWalletOutline, IoSettingsOutline } from "react-icons/io5";
import { BiHomeCircle } from "react-icons/bi";
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
  &:hover {
    cursor: pointer;
  }
`;

const SettingsIcon = styled(IoSettingsOutline)`
  width: 18px;
  height: 18px;
  &:hover {
    cursor: pointer;
  }
`;

const HomeIcon = styled(BiHomeCircle)`
  width: 18px;
  height: 18px;
  &:hover {
    cursor: pointer;
  }
`;

const SideBar = () => {
  const navigate = useNavigate();
  return (
    <MenuContainer>
      <HomeIcon
        onClick={(e) => {
          navigate("/");
        }}
      ></HomeIcon>
      <WalletIcon
        onClick={(e) => {
          navigate("/wallet");
        }}
      ></WalletIcon>
      <SettingsIcon
        onClick={(e) => {
          navigate("/");
        }}
      ></SettingsIcon>
    </MenuContainer>
  );
};

export default SideBar;
