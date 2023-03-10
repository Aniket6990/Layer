import React, { useEffect, useState } from "react";
import { VscTrash } from "react-icons/vsc";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setSettingNetworkConfig } from "../../store/extensionstore";
import { NetworkConfig } from "../../types";

const ConfigContainer = styled.div`
  height: 500px;
  overflow-y: scroll;
  border-radius: 10px;
  border: 1px solid var(--vscode-icon-foreground);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 20px 0px 20px 20px;
  gap: 14px;
`;

const Network = styled.div.attrs(
  (props: { isNetworkSelected: boolean; index: any }) => ({
    isNetworkSelected: props.isNetworkSelected,
    index: props.index,
  })
)`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: ${(props) =>
    !props.isNetworkSelected && props.index === 0
      ? "var(--vscode-button-hoverBackground)"
      : "transparent"};
  padding: 0.25rem 0.5rem 0.25rem 0.5rem;
  color: var(--vscode-button-foreground);
  border: none;
  font-size: 12px;
  font-weight: 600;
  &:hover {
    background-color: var(--vscode-button-hoverBackground);
    cursor: pointer;
  }
  &::selection {
    background-color: var(--vscode-button-hoverBackground);
  }
`;

const ConfigWrapper = styled.div`
  font-size: 12px;
  color: var(--vscode-icon-foreground);
  font-weight: 600;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  gap: 14px;
`;

const FullObjectWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 0.1fr;
  grid-template-rows: 1fr;
  column-gap: 10px;
  align-items: center;
`;

const TrashIcon = styled(VscTrash)`
  width: 16px;
  height: 16px;
  color: var(--vscode-icon-foreground);
  &:hover {
    cursor: pointer;
  }
`;

const Button = styled.button`
  width: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--vscode-button-background);
  padding: 0.25rem 0.5rem 0.25rem 0.5rem;
  color: var(--vscode-button-foreground);
  border: none;
  border-radius: 2px;
  &:hover {
    background-color: var(--vscode-button-hoverBackground);
    cursor: pointer;
  }
`;

const NetworkList = () => {
  const dispatch = useAppDispatch();
  const [isNetworkSelected, setIsNetworkSelected] = useState<boolean>(false);
  const networks = useAppSelector((state) => state.extension.networks);

  const getSelectedConf = (selectedNetwork: string) => {
    const selectedNetworkConfig = networks[selectedNetwork];
    const parsedConfig: NetworkConfig = JSON.parse(selectedNetworkConfig);
    return parsedConfig;
  };

  const handleNetworkSelection = (value: string) => {
    const newNetworkInit: NetworkConfig = {
      rpc: "",
      blockScanner: "",
      chainID: "",
      symbol: "",
      decimals: "",
    };
    const selectedNetworkConfig =
      value !== "Add New Network" ? getSelectedConf(value) : newNetworkInit;
    dispatch(
      setSettingNetworkConfig(JSON.parse(JSON.stringify(selectedNetworkConfig)))
    );
  };

  useEffect(() => {
    handleNetworkSelection("Ethereum");
  }, []);

  return (
    <ConfigContainer>
      <ConfigWrapper>
        <span>Networks</span>
        {Object.keys(networks).map((network, index) => {
          return (
            <FullObjectWrapper>
              <Network
                key={index}
                onClick={(e) => {
                  setIsNetworkSelected(true);
                  handleNetworkSelection(network);
                }}
                isNetworkSelected={isNetworkSelected}
                index={index}
              >
                {network}
              </Network>
              <TrashIcon></TrashIcon>
            </FullObjectWrapper>
          );
        })}
      </ConfigWrapper>
      <Button
        onClick={(e) => {
          setIsNetworkSelected(true);
          handleNetworkSelection("Add New Network");
        }}
      >
        Add New Network
      </Button>
    </ConfigContainer>
  );
};

export default NetworkList;
