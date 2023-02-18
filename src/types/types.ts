import { QuickPickItem } from "vscode";
import { JsonFragment } from "@ethersproject/abi";

export interface ISource {
  content: string | undefined;
}

export interface ISources {
  [key: string]: ISource;
}

export interface IAccount {
  label: string;
  value: string;
  pubAddr?: string;
  checksumAddr?: string;
}

export interface Account {
  pubAddr: string;
  checksumAddr: string;
}

export type LocalAddressType = {
  pubAddress: string;
  checksumAddress: string;
};

export type GanacheAddressType = string;

export interface TokenData {
  appId?: string;
  token?: string;
  email?: string;
}

export interface ICompilationResult {
  source: {
    target: string;
    sources: ISources;
  };
  data: any;
}

export interface INetworkQP extends QuickPickItem {
  label: string;
}
export interface IEthereumNetworkQP extends QuickPickItem {
  name: string;
  rpc: string;
  chainId?: number | string;
}

export interface IAccountQP extends QuickPickItem {
  checksumAddr: string;
}

export interface ICombinedJSONContractsQP extends QuickPickItem {
  contractKey: string;
}

export interface IStandardJSONContractsQP extends QuickPickItem {
  contractKey: string;
}

export interface IFunctionQP extends QuickPickItem {
  functionKey: string;
}

export interface ConstructorInputValue extends JsonFragment {
  value: string;
}

export interface EstimateGas {
  confidence: number;
  price: number;
  maxPriorityFeePerGas: number;
  maxFeePerGas: number;
}

export interface TxReceipt {
  transactionHash: string;
  transactionIndex: number;
  blockHash: string;
  blockNumber: number;
  from: string;
  to?: null;
  gasUsed: number;
  cumulativeGasUsed: number;
  contractAddress: string;
  logs?: null[] | null;
  status: number;
  logsBloom: string;
}

interface NativeCurrencyType {
  name: string;
  symbol: string;
  decimals: string;
}

export interface NetworkConfig {
  rpc: string;
  blockScanner: string;
  chainID: string;
  nativeCurrency: NativeCurrencyType;
}

export interface ERC4907ContractType {
  interface: string;
  contract: string;
  ERC4907Contract: string;
}

export interface ERC4907ContractType {
  interface: string;
  contract: string;
  ERC4907Contract: string;
}

export interface JSONDATA {
  networks: Object;
  addresses: Array<string>;
}

export interface TxObjecttype {
  ownerAddress: string;
  recipientAddress: string;
  selectedNetworkRpcUrl: string;
  value: string;
  gasLimit: string;
  pswd: string;
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

export interface ExtensionEventTypes {
  eventStatus: "success" | "fail";
  eventType: "layer_extensionCall" | "layer_ImutableCall" | "layer_mutableCall";
  eventResult: string | TxInterface;
}
// Typeguard

export function isConstructorInputValue(
  obj: any
): obj is ConstructorInputValue {
  return obj.value !== undefined;
}
