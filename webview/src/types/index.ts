import { JsonFragment } from "@ethersproject/abi";
interface NativeCurrencyType {
  name: string;
  symbol: string;
  decimal: string;
}

export interface NetworkConfig {
  rpc: string;
  blockScanner: string;
  chainID: string;
  nativeCurrency: NativeCurrencyType;
}

export interface TxInterface {
  from: string;
  to: string;
  txHash: string;
  gas?: string;
  exexutionCost?: string;
  transactionCost?: string;
  input?: string;
  decodedInput?: string | Object;
  decodedOutput?: string | Object;
  logs?: any;
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
}
