import { EventType, NetworkConfig } from "../../types/index";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { AiFillCheckCircle } from "react-icons/ai";
import { MdCancel } from "react-icons/md";
import { setIsHomeTx, setIsWalletTx } from "../../store/extensionstore";

const ConsoleContainer = styled.div`
  overflow-y: scroll;
  border: 1px solid var(--vscode-icon-foreground);
  border-radius: 10px;
  padding: 20px;
  color: var(--vscode-icon-foreground);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

const TransactionSuccessIcon = styled(AiFillCheckCircle)`
  height: 14px;
  width: 14px;
  color: #0af0ab;
`;

const TransactionFailureIcon = styled(MdCancel)`
  height: 14px;
  width: 14px;
  color: #fc652d;
`;

const ConsoleArea = () => {
  const dispatch = useAppDispatch();
  const [consoleMsg, setConsoleMsg] = useState<Array<EventType>>([]);
  const eventMsg = useAppSelector((state) => state.extension.eventMsg);
  const isHomeTx = useAppSelector((state) => state.extension.isHomeTx);
  const isWalletTx = useAppSelector((state) => state.extension.isWalletTx);
  const homeSelectedNetwork = useAppSelector(
    (state) => state.extension.selectedNetwork
  );
  const walletSelectedNetwork = useAppSelector(
    (state) => state.extension.walletNetwork
  );
  const homeSelectedNetConfig: NetworkConfig = useAppSelector(
    (state) => state.extension.selectedNetworkConfig
  );
  const walletSelectedNetConfig: NetworkConfig = useAppSelector(
    (state) => state.extension.walletNetworkConfig
  );

  useEffect(() => {
    setConsoleMsg([...consoleMsg, eventMsg as EventType]);
    console.log("I ran", eventMsg);
  }, [eventMsg]);
  return (
    <ConsoleContainer>
      <span>Events Console</span>

      {consoleMsg.map((message) => {
        if (message.msgType === "success" && message.eventType === "string") {
          return (
            <span>
              <TransactionSuccessIcon></TransactionSuccessIcon>
              {message.msg}
            </span>
          );
        } else if (
          message.msgType === "success" &&
          message.eventType === "txObject"
        ) {
          if (isWalletTx && walletSelectedNetwork !== "Select Network") {
            dispatch(setIsWalletTx(false));
            return (
              <span>{`Transaction is successful you can check transaction status at ${walletSelectedNetConfig.blockScanner}/${message.msg}`}</span>
            );
          }
          if (isHomeTx && homeSelectedNetwork !== "Select Network") {
            dispatch(setIsHomeTx(false));
            return (
              <span>{`Transaction is successful you can check transaction status at ${homeSelectedNetConfig.blockScanner}/${message.msg}`}</span>
            );
          }
          if (
            (isHomeTx || isWalletTx) &&
            (homeSelectedNetwork === "Hardhat Testnet" ||
              homeSelectedNetwork === "Ganache Testnet")
          ) {
            dispatch(setIsHomeTx(false));
            dispatch(setIsWalletTx(false));
            return (
              <span>{`Transaction is successful, transaction hash:${message.msg}`}</span>
            );
          }
        } else if (
          message.msgType === "success" &&
          message.eventType === "regular"
        ) {
          return <span>{message.msg}</span>;
        } else {
          dispatch(setIsHomeTx(false));
          dispatch(setIsWalletTx(false));
          return (
            <span>
              <TransactionFailureIcon></TransactionFailureIcon>
              {message.msg}
            </span>
          );
        }
      })}
    </ConsoleContainer>
  );
};

export default ConsoleArea;
