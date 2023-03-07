import React, { useState } from "react";
import { AiFillCheckCircle } from "react-icons/ai";
import { MdArrowForwardIos, MdCancel } from "react-icons/md";
import styled from "styled-components";
import { setSelectedNetwork } from "../../store/extensionstore";
import { TxInterface } from "../../types";
import { shortenText } from "../../utilities/functions";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ToggleHeader = styled.div`
  display: flex;
  justify-items: flex-start;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: var(--vscode-toolbar-hoverBackground);
  }
  background-color: ${(props) =>
    props.defaultChecked
      ? "var(--vscode-toolbar-hoverBackground)"
      : "var(--vscode-editor-background)"};
  gap: 10px;
`;

const TxnTitle = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-start;
  align-items: center;
  font-size: 12px;
  color: var(--vscode-icon-foreground);
`;

const TxData = styled.div`
  display: flex;
  padding: 10px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  cursor: pointer;
  background-color: ${(props) =>
    props.defaultChecked
      ? "var(--vscode-toolbar-hoverBackground)"
      : "var(--vscode-editor-background)"};
  gap: 2px;
`;

const RightArrow = styled(MdArrowForwardIos)`
  width: 14px;
  height: 14px;
  color: var(--vscode-icon-foreground);
`;

const DownArrow = styled(MdArrowForwardIos)`
  width: 14px;
  height: 14px;
  color: var(--vscode-icon-foreground);
  transform: rotate(90deg);
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

const TxDataContainer = (props: {
  open: boolean;
  txn: TxInterface;
  txnStatus: string;
}) => {
  const { open, txn, txnStatus } = props;
  return (
    <TxData defaultChecked={open}>
      <div
        style={{
          width: "100%",
        }}
      >
        <span>{`txn Hash: ${txn.txHash}`}</span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: 0,
          margin: 0,
          gap: "2px",
        }}
      >
        <span>{`from: ${txn.from}`}</span>
        <span>{`to: ${txn.to}`}</span>
        <span>{`gasCost: ${txn.gas}`}</span>
      </div>
    </TxData>
  );
};

const Toggle = (props: {
  txn: TxInterface;
  txnStatus: string;
  selectedNetwork: string;
}) => {
  const { selectedNetwork, txn, txnStatus } = props;
  const [open, setOpen] = useState(false);
  return (
    <Container>
      <ToggleHeader
        defaultChecked={open}
        onClick={(e) => setOpen((open) => !open)}
      >
        {txnStatus === "success" ? (
          <TransactionSuccessIcon></TransactionSuccessIcon>
        ) : (
          <TransactionFailureIcon></TransactionFailureIcon>
        )}
        {open ? <DownArrow></DownArrow> : <RightArrow></RightArrow>}
        <TxnTitle>
          <span>{`[${selectedNetwork}] from: ${shortenText(
            txn.from,
            4,
            4
          )} to: ${shortenText(txn.to, 4, 4)} hash: ${shortenText(
            txn.txHash,
            4,
            4
          )}`}</span>
        </TxnTitle>
      </ToggleHeader>
      {open && <TxDataContainer open={open} txn={txn} txnStatus={txnStatus} />}
    </Container>
  );
};

export default Toggle;
