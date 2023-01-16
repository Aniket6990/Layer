import { EventType } from "../../types/index";
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
  const [consoleMsg, setConsoleMsg] = useState<Array<EventType>>([]);
  const eventMsg = useAppSelector((state) => state.extension.eventMsg);

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
        } else {
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
