import {
  VSCodeButton,
  VSCodeTextField,
} from "@vscode/webview-ui-toolkit/react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { addNewNetwork } from "../../configuration/webviewpostmsg";
import { setSettingNetwork } from "../../store/extensionstore";
import { NetworkConfig } from "../../types";

const ConfigContainer = styled.div`
  height: 500px;
  overflow-y: scroll;
  border-radius: 10px;
  border: 1px solid var(--vscode-icon-foreground);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 20px 0px 20px 20px;
  gap: 14px;
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
  gap: 8px;
`;

const FullObjectWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 0.1fr;
  grid-template-rows: 1fr;
  column-gap: 10px;
  align-items: center;
`;

const TextField = styled(VSCodeTextField)`
  width: 100%;
  font-size: 12px;
  border: 1px solid var(--vscode-icon-foreground);
`;

const ErrorMessage = styled.span`
  color: red;
  font-size: 12px;
  justify-self: center;
`;

const NetworkDetails = () => {
  const dispatch = useAppDispatch();
  const settingNetworkConfig = useAppSelector(
    (state) => state.extension.settingNetworkConfig
  );
  const settingNetwork = useAppSelector(
    (state) => state.extension.settingNetwork
  );
  const [networkInfo, setNetworkInfo] =
    useState<NetworkConfig>(settingNetworkConfig);
  const [errorMsg, setErrorMsg] = useState<string | undefined>(undefined);

  useEffect(() => {
    setNetworkInfo(settingNetworkConfig);
  }, [settingNetworkConfig]);

  const parameterCheck = () => {
    if (settingNetwork === "Add New Network") {
      return "Network name is required*";
    }
    if (
      !networkInfo.rpc ||
      !networkInfo.blockScanner ||
      !networkInfo.chainID ||
      !networkInfo.symbol ||
      !networkInfo.decimals
    ) {
      return "All fields are required*";
    }
    return;
  };

  const handleSave = () => {
    const paramCheck = parameterCheck();
    if (paramCheck !== undefined) {
      setErrorMsg(paramCheck);
    } else {
      setErrorMsg(undefined);
      addNewNetwork(settingNetwork, networkInfo);
    }
  };
  return (
    <ConfigContainer>
      <ConfigWrapper>
        <span>Network Name</span>
        <FullObjectWrapper>
          <TextField
            placeholder="e.g Ethereum"
            value={settingNetwork}
            onChange={(e: any) => {
              dispatch(setSettingNetwork(e.target.value));
            }}
            disabled={networkInfo.isDefault}
          ></TextField>
        </FullObjectWrapper>
      </ConfigWrapper>
      <ConfigWrapper>
        <span>RPC Url</span>
        <FullObjectWrapper>
          <TextField
            placeholder="e.g http://localhost:7545"
            value={networkInfo.rpc}
            onChange={(e: any) => {
              setNetworkInfo({ ...networkInfo, rpc: e.target.value });
            }}
            disabled={networkInfo.isDefault}
          ></TextField>
        </FullObjectWrapper>
      </ConfigWrapper>
      <ConfigWrapper>
        <span>Blockscanner Url</span>
        <FullObjectWrapper>
          <TextField
            placeholder="e.g http://localhost:7545"
            value={networkInfo.blockScanner}
            onChange={(e: any) => {
              setNetworkInfo({ ...networkInfo, blockScanner: e.target.value });
            }}
            disabled={networkInfo.isDefault}
          ></TextField>
        </FullObjectWrapper>
      </ConfigWrapper>
      <ConfigWrapper>
        <span>ChainId</span>
        <FullObjectWrapper>
          <TextField
            placeholder="e.g 1"
            value={networkInfo.chainID}
            onChange={(e: any) => {
              setNetworkInfo({ ...networkInfo, chainID: e.target.value });
            }}
            disabled={networkInfo.isDefault}
          ></TextField>
        </FullObjectWrapper>
      </ConfigWrapper>
      <ConfigWrapper>
        <span>Currency Symbol</span>
        <FullObjectWrapper>
          <TextField
            placeholder="e.g ETH"
            value={networkInfo.symbol}
            onChange={(e: any) => {
              setNetworkInfo({ ...networkInfo, symbol: e.target.value });
            }}
            disabled={networkInfo.isDefault}
          ></TextField>
        </FullObjectWrapper>
      </ConfigWrapper>
      <ConfigWrapper>
        <span>Decimals</span>
        <FullObjectWrapper>
          <TextField
            placeholder="e.g 18"
            value={networkInfo.decimals}
            onChange={(e: any) => {
              setNetworkInfo({ ...networkInfo, decimals: e.target.value });
            }}
            disabled={networkInfo.isDefault}
          ></TextField>
        </FullObjectWrapper>
      </ConfigWrapper>
      <ConfigWrapper>
        <ErrorMessage>{errorMsg !== undefined && errorMsg}</ErrorMessage>
        <VSCodeButton
          onClick={(e) => {
            handleSave();
          }}
          disabled={networkInfo.isDefault}
        >
          Save
        </VSCodeButton>
      </ConfigWrapper>
    </ConfigContainer>
  );
};

export default NetworkDetails;
