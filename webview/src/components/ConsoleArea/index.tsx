import { TxInterface, WebViewEventType } from "../../types/index";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useAppSelector } from "../../app/hooks";
import { AiFillCheckCircle } from "react-icons/ai";
import { MdCancel } from "react-icons/md";

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
  const [consoleMsg, setConsoleMsg] = useState<Array<WebViewEventType>>([]);
  const eventMsg = useAppSelector((state) => state.extension.eventMsg);

  useEffect(() => {
    setConsoleMsg([...consoleMsg, eventMsg as WebViewEventType]);
  }, [eventMsg]);
  return (
    <ConsoleContainer>
      <span>Events Console</span>

      {consoleMsg.map((message) => {
        if (
          message.eventStatus === "success" &&
          message.eventType === "layer_extensionCall"
        ) {
          return (
            <span>
              <TransactionSuccessIcon></TransactionSuccessIcon>
              {message.eventResult as string}
            </span>
          );
        } else if (
          message.eventStatus === "success" &&
          (message.eventType === "layer_ImutableCall" ||
            message.eventType === "layer_mutableCall")
        ) {
          return (
            <span>
              <TransactionSuccessIcon></TransactionSuccessIcon>
              {(message.eventResult as TxInterface).txHash}
            </span>
          );
        } else if (
          message.eventStatus === "fail" &&
          (message.eventType === "layer_ImutableCall" ||
            message.eventType === "layer_mutableCall")
        ) {
          return <span>{(message.eventResult as TxInterface).txHash}</span>;
        } else {
          return (
            <span>
              <TransactionFailureIcon></TransactionFailureIcon>
              {message.eventResult as string}
            </span>
          );
        }
      })}
    </ConsoleContainer>
  );
};

export default ConsoleArea;
