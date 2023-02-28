import { ethers } from "ethers";
import { Webview, WebviewPanel } from "vscode";
import { CompiledJSONOutput, TxInterface } from "../types";

export const generateTxnInterface = (
  receipt: ethers.providers.TransactionReceipt
) => {
  const txnReceipt: TxInterface = {
    from: receipt.from,
    to: receipt.to,
    txHash: receipt.transactionHash,
    gas: ethers.utils.formatUnits(receipt.gasUsed, "wei"),
  };
  return txnReceipt;
};

export const getABIType = (contract: CompiledJSONOutput): any => {
  if (contract.contractType === 0) return [];

  if (contract.contractType === 1) return contract.hardhatOutput?.abi;

  return contract.remixOutput?.abi;
};

export const getContractByteCode = (
  output: CompiledJSONOutput
): ethers.utils.BytesLike | undefined => {
  if (output.contractType === 0) return "";

  if (output.contractType === 1) return output.hardhatOutput?.bytecode;

  return output.remixOutput?.data.bytecode.object;
};

export const isTestingNetwork: any = (network: string) => {
  if (network === "Ganache Testnet") return true;

  if (network === "Hardhat Testnet") return true;

  return false;
};
