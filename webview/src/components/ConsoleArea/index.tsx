import { TxInterface, WebViewEventType } from "../../types/index";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useAppSelector } from "../../app/hooks";
import { AiFillCheckCircle } from "react-icons/ai";
import { MdCancel } from "react-icons/md";
import { VscClearAll } from "react-icons/vsc";
import Toggle from "../UI/Toggle";

const ConsoleContainer = styled.div`
  overflow-y: scroll;
  border: 1px solid var(--vscode-icon-foreground);
  border-radius: 10px;
  padding: 20px;
  color: var(--vscode-icon-foreground);
  font-weight: 600;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 5px;
`;

const ConsoleHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 3px;
`;

const TransactionSuccessIcon = styled(AiFillCheckCircle)`
  height: 16px;
  width: 16px;
  color: #0af0ab;
`;

const TransactionFailureIcon = styled(MdCancel)`
  height: 16px;
  width: 16px;
  color: #fc652d;
`;

const TransactionContainer = styled.div`
  width: 100%;
  display: flex;
  gap: 5px;
  justify-content: flex-start;
  align-items: flex-start;
`;

const ConsoleClearIcon = styled(VscClearAll)`
  height: 16px;
  width: 16px;
  color: var(--vscode-icon-foreground);
`;
const ConsoleArea = () => {
  const [consoleMsg, setConsoleMsg] = useState<Array<WebViewEventType>>([]);
  const eventMsg = useAppSelector((state) => state.extension.eventMsg);

  useEffect(() => {
    setConsoleMsg([...consoleMsg, eventMsg as WebViewEventType]);
  }, [eventMsg]);

  return (
    <ConsoleContainer>
      <ConsoleHeader>
        <span>Events Console</span>
        <ConsoleClearIcon
          onClick={(e) => {
            setConsoleMsg([]);
          }}
        ></ConsoleClearIcon>
      </ConsoleHeader>

      {consoleMsg.map((message) => {
        if (
          message.eventStatus === "success" &&
          (message.eventType === "layer_extensionCall" ||
            message.eventType === "layer_msg")
        ) {
          return (
            <TransactionContainer>
              {message.eventType !== "layer_msg" && (
                <TransactionSuccessIcon></TransactionSuccessIcon>
              )}
              {message.eventResult as string}
            </TransactionContainer>
          );
        } else if (
          message.eventType === "layer_ImutableCall" ||
          message.eventType === "layer_mutableCall"
        ) {
          return (
            <Toggle
              txn={message.eventResult as TxInterface}
              txnStatus={message.eventStatus}
              selectedNetwork={"polygon mumbai"}
            />
          );
        } else {
          return (
            <TransactionContainer>
              <TransactionFailureIcon></TransactionFailureIcon>
              {message.eventResult as string}
            </TransactionContainer>
          );
        }
      })}
    </ConsoleContainer>
  );
};

export default ConsoleArea;
