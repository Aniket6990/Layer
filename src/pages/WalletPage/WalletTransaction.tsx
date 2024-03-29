import {
  VSCodeButton,
  VSCodeDropdown,
  VSCodeOption,
  VSCodeTextField,
} from "@vscode/webview-ui-toolkit/react";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  displayWalletAccountBalance,
  sendTokenTransaction,
} from "../../configuration/webviewpostmsg";
import {
  setEventMsg,
  setIsWalletTx,
  setWalletNetwork,
  setWalletNetworkConfig,
} from "../../store/extensionstore";
import { NetworkConfig, TxObjecttype } from "../../types";
import {
  containOnlyDigits,
  isLocalNetwork,
  isValidAddress,
} from "../../utilities/functions";

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

const Header = styled.span`
  font-size: 14px;
  color: var(--vscode-icon-foreground);
  font-weight: 600;
  align-self: flex-start;
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

const DropDown = styled(VSCodeDropdown)`
  font-size: 12px;
  border: 1px solid var(--vscode-icon-foreground);
`;

const FullObjectWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 0.1fr;
  grid-template-rows: 1fr;
  column-gap: 10px;
  align-items: center;
`;

const SemiWrapper = styled.div`
  width: 90%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  column-gap: 10px;
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

const WalletTransaction = () => {
  const dispatch = useAppDispatch();
  const networks = useAppSelector((state) => state.extension.networks);
  const walletAccount = useAppSelector(
    (state) => state.extension.walletAccount
  );
  const walletNetConfig: NetworkConfig = useAppSelector(
    (state) => state.extension.walletNetworkConfig
  );
  const walletAccountBalance = useAppSelector(
    (state) => state.extension.walletAccountBalance
  );
  const walletSelectedNetwork = useAppSelector(
    (state) => state.extension.walletNetwork
  );
  const [gasLimit, setGasLimit] = useState<string>("21000");
  const [amount, SetAmount] = useState<string>("");
  const [recipientAddress, setRecipientAddress] = useState<string>("");
  const [pswd, setPswd] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    if (
      walletAccount !== "Select Account" &&
      walletNetConfig.rpc !== undefined
    ) {
      displayWalletAccountBalance(walletAccount, walletNetConfig.rpc);
    }
  }, [walletAccount, walletNetConfig]);

  const getSelectedConf = (selectedNetwork: string) => {
    const selectedNetworkConfig = networks[selectedNetwork];
    const parsedConfig: NetworkConfig = JSON.parse(selectedNetworkConfig);
    return parsedConfig;
  };

  const handleNetworkDropdownChange = (event: any) => {
    dispatch(setWalletNetwork(event.target.value));
    const selectedNetworkConfig: NetworkConfig = getSelectedConf(
      event.target.value
    );
    dispatch(setWalletNetworkConfig(selectedNetworkConfig));
  };

  const handleSendTransaction = () => {
    if (
      walletAccount !== "Select Account" &&
      walletNetConfig.rpc !== undefined &&
      parseInt(gasLimit) >= 21000 &&
      isValidAddress(recipientAddress) &&
      parseFloat(amount) > 0 &&
      pswd !== ""
    ) {
      setErrorMsg("");
      setPswd("");
      const txObject: TxObjecttype = {
        ownerAddress: walletAccount,
        recipientAddress: recipientAddress,
        selectedNetworkRpcUrl: walletNetConfig.rpc,
        gasLimit: gasLimit,
        value: amount,
        pswd: pswd,
      };
      dispatch(
        setEventMsg({
          eventStatus: "success",
          eventType: "layer_msg",
          eventResult: `Transferring ${amount} ${walletNetConfig.symbol} to ${recipientAddress}`,
        })
      );
      sendTokenTransaction(txObject);
    }
    if (walletAccount === "Select Account") {
      setErrorMsg("Please select an account.");
    }
    if (walletNetConfig.rpc === undefined) {
      setErrorMsg("Please select an Network.");
    }
    if (parseInt(gasLimit) < 21000) {
      setErrorMsg("Gaslimit should be more than 21000");
    }
    if (!isValidAddress(recipientAddress)) {
      setErrorMsg("Recipient address is not valid.");
    }
    if (parseFloat(amount) <= 0) {
      setErrorMsg("Amount should be more than 0.");
    }
    if (pswd === "") {
      setErrorMsg("Please enter password.");
    }
  };
  return (
    <ConfigContainer>
      <Header>Transfer asset</Header>
      {/* Network selection field */}
      <ConfigWrapper>
        <span>Network</span>
        <FullObjectWrapper>
          <DropDown
            value={walletSelectedNetwork}
            onChange={(e: any) => {
              handleNetworkDropdownChange(e);
            }}
          >
            <VSCodeOption value="Select Network">Select Network</VSCodeOption>
            {Object.keys(networks).map((network, index) => {
              return (
                !isLocalNetwork(network) && (
                  <VSCodeOption key={index} value={network}>
                    {network}
                  </VSCodeOption>
                )
              );
            })}
          </DropDown>
        </FullObjectWrapper>
      </ConfigWrapper>
      {/* Show selected account field */}
      <ConfigWrapper>
        <span>From</span>
        <FullObjectWrapper>
          <TextField
            value={`${
              walletAccount !== "Select Account"
                ? walletAccount
                : "No account selected"
            }`}
            disabled
          ></TextField>
        </FullObjectWrapper>
      </ConfigWrapper>
      {/* Show balance filed */}
      <ConfigWrapper>
        <span>Balance</span>
        <FullObjectWrapper>
          <TextField
            value={`${walletAccountBalance} ${
              walletSelectedNetwork !== "Select Network"
                ? walletNetConfig.symbol
                : "ETH"
            }`}
            disabled
          ></TextField>
        </FullObjectWrapper>
      </ConfigWrapper>
      {/* Recipient textfield area */}
      <ConfigWrapper>
        <span>Recipient Address</span>
        <FullObjectWrapper>
          <TextField
            placeholder="0x53..."
            value={recipientAddress}
            onChange={(e: any) => {
              setRecipientAddress(e.target.value);
            }}
          ></TextField>
        </FullObjectWrapper>
      </ConfigWrapper>
      {/* Transaction amount and gaslimit area */}
      <ConfigWrapper>
        <SemiWrapper>
          <ConfigWrapper>
            <span>Amount</span>
            <TextField
              placeholder="1"
              value={amount}
              onChange={(e: any) => {
                if (containOnlyDigits(e.target.value)) {
                  setErrorMsg("");
                  SetAmount(e.target.value);
                } else {
                  setErrorMsg("Amount should be in a digit.");
                }
              }}
            ></TextField>
          </ConfigWrapper>
          <ConfigWrapper>
            <span>Gas Limit</span>
            <TextField
              value={gasLimit}
              onChange={(e: any) => {
                if (containOnlyDigits(e.target.value)) {
                  setErrorMsg("");
                  setGasLimit(e.target.value);
                } else {
                  setErrorMsg("Gaslimit should be in a digit.");
                }
              }}
            ></TextField>
          </ConfigWrapper>
        </SemiWrapper>
      </ConfigWrapper>
      {/* password input field */}
      <ConfigWrapper>
        <span>Password</span>
        <FullObjectWrapper>
          <TextField
            type="password"
            value={pswd}
            onChange={(e: any) => {
              setPswd(e.target.value);
            }}
          ></TextField>
        </FullObjectWrapper>
      </ConfigWrapper>
      {/* send transaction button */}
      <ConfigWrapper>
        <ErrorMessage>{errorMsg}</ErrorMessage>
        <VSCodeButton
          onClick={(e) => {
            handleSendTransaction();
          }}
        >
          Send
        </VSCodeButton>
      </ConfigWrapper>
    </ConfigContainer>
  );
};

export default WalletTransaction;
