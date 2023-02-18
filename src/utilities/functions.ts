import { ethers } from "ethers";
import { TxInterface } from "../types";

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
