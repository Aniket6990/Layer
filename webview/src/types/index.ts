import { JsonFragment } from "@ethersproject/abi";

export interface NetworkConfig {
  rpc: string;
  blockScanner: string;
  chainID: string;
  symbol: string;
  decimals: string;
  isDefault: boolean;
}

export interface TxInterface {
  from: string;
  to: string;
  txHash?: string;
  gasLimit?: string;
  gasUsed?: string;
  input?: string;
  decodedInput?: string[];
  decodedOutput?: string[];
  logs?: string;
  value?: string;
}

export interface WebViewEventType {
  eventStatus: "success" | "fail";
  eventType:
    | "layer_extensionCall"
    | "layer_ImutableCall"
    | "layer_mutableCall"
    | "layer_msg";
  eventResult: string | TxInterface;
}

export interface TxObjecttype {
  ownerAddress: string;
  recipientAddress: string;
  selectedNetworkRpcUrl: string;
  value: string;
  gasLimit: string;
  pswd: string;
}

export interface JsonFragmentType {
  readonly name?: string;
  readonly indexed?: boolean;
  readonly type?: string;
  readonly internalType?: any;
  readonly components?: ReadonlyArray<JsonFragmentType>;
  value?: string;
}

export interface FunctionObjectType {
  name?: string;
  stateMutability?: string;
  type?: string;
  inputs: Array<JsonFragmentType>;
  outputs: Array<JsonFragmentType>;
}
