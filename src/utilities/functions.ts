import { ethers } from "ethers";
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
