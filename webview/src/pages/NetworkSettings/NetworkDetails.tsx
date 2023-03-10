import {
  VSCodeButton,
  VSCodeTextField,
} from "@vscode/webview-ui-toolkit/react";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

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

  return (
    <ConfigContainer>
      <ConfigWrapper>
        <span>RPC Url</span>
        <FullObjectWrapper>
          <TextField value={settingNetworkConfig.rpc}></TextField>
        </FullObjectWrapper>
      </ConfigWrapper>
      <ConfigWrapper>
        <span>Blockscanner Url</span>
        <FullObjectWrapper>
          <TextField value={settingNetworkConfig.blockScanner}></TextField>
        </FullObjectWrapper>
      </ConfigWrapper>
      <ConfigWrapper>
        <span>ChainId</span>
        <FullObjectWrapper>
          <TextField value={settingNetworkConfig.chainID}></TextField>
        </FullObjectWrapper>
      </ConfigWrapper>
      <ConfigWrapper>
        <span>Currency Symbol</span>
        <FullObjectWrapper>
          <TextField value={settingNetworkConfig.symbol}></TextField>
        </FullObjectWrapper>
      </ConfigWrapper>
      <ConfigWrapper>
        <span>Decimals</span>
        <FullObjectWrapper>
          <TextField value={settingNetworkConfig.decimals}></TextField>
        </FullObjectWrapper>
      </ConfigWrapper>
      <ConfigWrapper>
        <ErrorMessage></ErrorMessage>
        <VSCodeButton>Save</VSCodeButton>
      </ConfigWrapper>
    </ConfigContainer>
  );
};

export default NetworkDetails;
