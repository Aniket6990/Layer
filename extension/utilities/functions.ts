import { ethers } from "ethers";
import { ExtensionContext, Webview, WebviewPanel } from "vscode";
import { exportPvtKeyPair, getSelectedNetworkProvider } from "../config";
import { ReactPanel } from "../panels/ReactPanel";
import { CompiledJSONOutput, FunctionObjectType, TxInterface } from "../types";

export const generateTxnInterface = async (props: {
  receipt: ethers.providers.TransactionReceipt;
  rpcUrl: string;
  functionObject?: FunctionObjectType;
  gasLimit: string;
  params?: Array<string>;
  contractName?: string;
}) => {
  const { gasLimit, receipt, rpcUrl, functionObject, params, contractName } =
    props;
  const provider = await getSelectedNetworkProvider(rpcUrl as string);
  let inputData: string = "0x0000000000000000000000000000000000000000000000000";
  const txn = await provider.getTransaction(receipt.transactionHash);
  const decodedInput: Array<string> | undefined = !!params?.length
    ? functionObject?.inputs.map((input, index) => {
        return `${index}: ${input.type}: ${params[index]}`;
      })
    : undefined;
  const txnReceipt: TxInterface = {
    from: receipt.from,
    to: receipt.to !== null ? receipt.to : (contractName as string),
    txHash: receipt.transactionHash,
    gasLimit: gasLimit,
    gasUsed: ethers.utils.formatUnits(receipt.gasUsed, "wei"),
    input: txn.data ? txn.data : inputData,
    decodedInput: decodedInput !== undefined ? decodedInput : [],
    logs: JSON.stringify(receipt.logs),
    value: ethers.utils.formatUnits(txn.value, "wei"),
  };
  return txnReceipt;
};

export const getCallInterface = (
  from: string,
  to: string,
  functionObject: FunctionObjectType,
  params: Array<string>,
  result: Array<string>
) => {
  const decodedInput: Array<string> = !!params.length
    ? functionObject.inputs.map((input, index) => {
        return `${index}: ${input.type}: ${params[index]}`;
      })
    : [""];
  const decodedOutput: Array<string> =
    functionObject.outputs.length > 1
      ? functionObject.outputs.map((output, index) => {
          return `${index}: ${output.type}: ${result[index]}`;
        })
      : [`0: ${functionObject.outputs[0].type}: ${result}`];
  const callReceipt: TxInterface = {
    from: from,
    to: to,
    decodedInput: decodedInput,
    decodedOutput: !!functionObject.outputs.length ? decodedOutput : [""],
  };
  return callReceipt;
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

export const isTestingNetwork = (network: string) => {
  if (network === "Ganache Network") return true;

  if (network === "Hardhat Network") return true;

  return false;
};

export const isValidHttpUrl = (url_: string): boolean => {
  let url;

  try {
    url = new URL(url_);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
};

export const getContractFactoryWithParams = async (
  context: ExtensionContext,
  contractName: string,
  password: string,
  selectedAccount: string,
  selectedNetwork: string,
  rpcURL: string
): Promise<ethers.ContractFactory | undefined> => {
  const contracts = context.workspaceState.get("contracts") as {
    [name: string]: CompiledJSONOutput;
  };
  const contractJSONOutput: CompiledJSONOutput = contracts[contractName];

  const abi = getABIType(contractJSONOutput);
  if (abi === undefined) throw new Error("Abi is not defined.");

  const byteCode = getContractByteCode(contractJSONOutput);
  if (byteCode === undefined) throw new Error("ByteCode is not defined.");

  let myContract;
  if (isTestingNetwork(selectedNetwork) === true) {
    // Deploy to ganache network
    const provider = getSelectedNetworkProvider(
      rpcURL
    ) as ethers.providers.JsonRpcProvider;
    const signer = provider.getSigner();
    myContract = new ethers.ContractFactory(abi, byteCode, signer);
  } else {
    // Deploy to ethereum network
    const privateKey = await exportPvtKeyPair(
      context,
      selectedAccount,
      password
    );
    if (privateKey.eventStatus === "fail") {
      ReactPanel.EmitExtensionEvent({
        eventStatus: "fail",
        eventType: "layer_extensionCall",
        eventResult: `Password for ${selectedAccount} is wrong.`,
      });
      return;
    }
    const provider = getSelectedNetworkProvider(rpcURL);
    const wallet = new ethers.Wallet(privateKey.eventResult as string);
    const signingAccount = wallet.connect(provider);
    myContract = new ethers.ContractFactory(abi, byteCode, signingAccount);
  }
  return myContract;
};

export const getSignedContract = async (
  context: ExtensionContext,
  contractName: string,
  contractAddress: string,
  password: string,
  selectedAccount: string,
  selectedNetwork: string,
  rpcURL: string
): Promise<ethers.Contract | undefined> => {
  const contracts = context.workspaceState.get("contracts") as {
    [name: string]: CompiledJSONOutput;
  };
  const contractJSONOutput: CompiledJSONOutput = contracts[contractName];

  const abi = getABIType(contractJSONOutput);
  if (abi === undefined) throw new Error("Abi is not defined.");

  const byteCode = getContractByteCode(contractJSONOutput);
  if (byteCode === undefined) throw new Error("ByteCode is not defined.");

  let myContract;
  if (isTestingNetwork(selectedNetwork) === true) {
    // Deploy to ganache network
    const provider = getSelectedNetworkProvider(
      rpcURL
    ) as ethers.providers.JsonRpcProvider;
    const signer = provider.getSigner();
    myContract = new ethers.Contract(contractAddress, abi, signer);
  } else {
    // Deploy to ethereum network
    const privateKey = await exportPvtKeyPair(
      context,
      selectedAccount,
      password
    );
    if (privateKey.eventStatus === "fail") {
      ReactPanel.EmitExtensionEvent({
        eventStatus: "fail",
        eventType: "layer_extensionCall",
        eventResult: `Password for ${selectedAccount} is wrong.`,
      });
      return;
    }
    const provider = getSelectedNetworkProvider(rpcURL);
    const wallet = new ethers.Wallet(privateKey.eventResult as string);
    const signingAccount = wallet.connect(provider);
    myContract = new ethers.Contract(contractAddress, abi, signingAccount);
  }
  return myContract;
};
