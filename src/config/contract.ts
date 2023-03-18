import { ExtensionContext, workspace } from "vscode";
import * as path from "path";
import * as fs from "fs";

import { logger } from "../lib";
import {
  CompiledJSONOutput,
  ConstructorInputValue,
  ExtensionEventTypes,
  FunctionObjectType,
  IFunctionQP,
  isHardhatProject,
  JsonFragmentType,
} from "../types";
import { getDirectoriesRecursive } from "../lib/file";
import {
  generateTxnInterface,
  getABIType,
  getContractByteCode,
  getContractFactoryWithParams,
  getSignedContract,
  isTestingNetwork,
} from "../utilities/functions";
import { JsonFragment } from "@ethersproject/abi";
import { ethers } from "ethers";
import { exportPvtKeyPair, getSelectedNetworkProvider } from "./account";
import { ReactPanel } from "../panels/ReactPanel";
import { config } from "process";
import { getLatestGasPrice } from "./network";

// load all compiled contracts
export const loadAllCompiledContracts = (context: ExtensionContext) => {
  if (workspace.workspaceFolders === undefined) {
    logger.error(new Error("Please open your solidity project to vscode"));
    return;
  }

  context.workspaceState.update("contracts", ""); // Initialize contracts storage

  const path_ = workspace.workspaceFolders[0].uri.fsPath;
  const paths: Array<string> = loadAllCompiledJsonOutputs(path_);

  paths.forEach((e) => {
    let name = path.parse(e).base;
    name = name.substring(0, name.length - 5);

    const data = fs.readFileSync(e);
    const output: CompiledJSONOutput = getCompiledJsonObject(data);

    if (output.contractType === 0) return;
    output.path = path.dirname(e);
    output.name = name;

    let contracts = context.workspaceState.get("contracts") as any;

    if (contracts === undefined || contracts === "") contracts = new Map();

    contracts[name] = output;
    context.workspaceState.update("contracts", contracts);
  });
  const contracts = context.workspaceState.get("contracts") as {
    [name: string]: CompiledJSONOutput;
  };
  let compiledContracts = Object.keys(contracts).map((contract) => {
    return contract;
  });
  return compiledContracts;
};

const getCompiledJsonObject = (_jsonPayload: any): CompiledJSONOutput => {
  const output: CompiledJSONOutput = { contractType: 0 };

  try {
    const data = JSON.parse(_jsonPayload);

    if (data.bytecode !== undefined) {
      // Hardhat format

      output.contractType = 1;
      output.hardhatOutput = data;
    } else if (data.data !== undefined) {
      // Remix format

      output.contractType = 2;
      output.remixOutput = data;
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }

  return output;
};

const loadAllCompiledJsonOutputs = (path_: string) => {
  let allFiles;

  if (isHardhatProject(path_))
    allFiles = getDirectoriesRecursive(
      path.join(path_, "artifacts", "contracts"),
      0
    );
  else allFiles = getDirectoriesRecursive(path_, 0);

  const changedFiles = allFiles.filter((e: any) => {
    let fileName = path.parse(e).base;
    fileName = fileName.substring(0, fileName.length - 5);
    if (!fileName.includes(".")) return true;
    return false;
  });

  return changedFiles;
};

export const getContractConstructor = (
  context: ExtensionContext,
  contract: string
): FunctionObjectType[] | undefined => {
  const contracts = context.workspaceState.get("contracts") as {
    [name: string]: CompiledJSONOutput;
  };
  if (contracts === undefined || Object.keys(contracts).length === 0) return;
  if (contract === undefined) return;

  const contractName = Object.keys(contracts).filter(
    (i: string) => i === contract
  );
  const contractJSONOutput: CompiledJSONOutput = contracts[contractName[0]];
  const contractConstructor = getABIType(contractJSONOutput)?.filter(
    (i: JsonFragment) => i.type === "constructor"
  );

  if (contractConstructor === undefined || contractConstructor.length === 0) {
    return;
  }

  const constInps = contractConstructor[0].inputs;
  if (constInps == null || constInps.length === 0) {
    return;
  }

  const constructorObject: FunctionObjectType[] = contractConstructor.map(
    (e: {
      name: string;
      stateMutability: string;
      inputs: JsonFragmentType[];
      type: string;
    }) => ({
      stateMutability: e.stateMutability,
      type: e.type,
      inputs: e.inputs?.map((c) => ({ ...c, value: "" })),
    })
  );

  return constructorObject;
};

export const deploySelectedContract = async (
  context: ExtensionContext,
  contractName: string,
  params: string[],
  password: string,
  selectedNetwork: string,
  selectedAccount: string,
  rpcURL: string,
  gasLimit: string,
  value: string
) => {
  const contracts = context.workspaceState.get("contracts") as {
    [name: string]: CompiledJSONOutput;
  };
  const contractJSONOutput: CompiledJSONOutput = contracts[contractName];
  let extensionEvent: ExtensionEventTypes = {
    eventStatus: "success",
    eventType: "layer_msg",
    eventResult: `Deploying ${contractName}.sol`,
  };
  ReactPanel.EmitExtensionEvent(extensionEvent);
  try {
    const myContract = await getContractFactoryWithParams(
      context,
      contractName,
      password,
      selectedAccount,
      selectedNetwork,
      rpcURL
    );

    const gasPrice = await getLatestGasPrice(rpcURL);
    const parameters = !!params.length ? params : [];

    if (myContract !== undefined) {
      const contract = await myContract.deploy(...parameters, {
        value: value,
        gasPrice: gasPrice,
        gasLimit: gasLimit,
      });
      await addContractAddress(contractJSONOutput, {
        network: selectedNetwork,
        address: contract.address,
        contractName: contractName,
      });
      extensionEvent = {
        eventStatus: "success",
        eventType: "layer_extensionCall",
        eventResult: `${contractName}.sol deployed on ${contract.address}`,
      };
      return extensionEvent;
    }
  } catch (err: any) {
    extensionEvent = {
      eventStatus: "fail",
      eventType: "layer_extensionCall",
      eventResult: `Error while deploying ${contractName} ${err.message}`,
    };
    return extensionEvent;
  }
};

const getContractArtifactPath = (contract: CompiledJSONOutput) => {
  if (contract.path === undefined) {
    throw new Error("Contract Path is empty.");
  }

  return path.join(contract.path, `${contract.name as string}.json`);
};

// add deployed contract address to the json file
export const addContractAddress = async (
  contract: CompiledJSONOutput,
  deployConfig: { network: string; address: string; contractName: string }
) => {
  if (contract === undefined) return Error("No contract available.");
  const path = getContractArtifactPath(contract);
  const contractJsonOutput = fs.readFileSync(path, {
    encoding: "utf-8",
  });

  const parsedContractJson = JSON.parse(contractJsonOutput);
  if (parsedContractJson.deployed && !!parsedContractJson.deployed.length) {
    const isPresent = parsedContractJson.deployed.filter(
      (config: { network: string; address: string; contractName: string }) =>
        config.network === deployConfig.network
    );
    if (!!isPresent.length) {
      const dataToAdd = parsedContractJson.deployed.map(
        (config: {
          network: string;
          address: string;
          contractName: string;
        }) => {
          if (config.network === deployConfig.network) {
            return {
              network: config.network,
              address: deployConfig.address,
              contractName: deployConfig.contractName,
            };
          } else {
            return config;
          }
        }
      );
      const addDeployedInput = {
        ...JSON.parse(contractJsonOutput),
        deployed: dataToAdd,
      };
      fs.writeFileSync(path, JSON.stringify(addDeployedInput));
    } else {
      const addDeployedInput = {
        ...JSON.parse(contractJsonOutput),
        deployed: [
          ...JSON.parse(contractJsonOutput).deployed,
          {
            network: deployConfig.network,
            address: deployConfig.address,
            contractName: deployConfig.contractName,
          },
        ],
      };
      fs.writeFileSync(path, JSON.stringify(addDeployedInput));
    }
  } else {
    const addDeployedInput = {
      ...JSON.parse(contractJsonOutput),
      deployed: [
        {
          network: deployConfig.network,
          address: deployConfig.address,
          contractName: deployConfig.contractName,
        },
      ],
    };
    fs.writeFileSync(path, JSON.stringify(addDeployedInput));
  }
};

export const fetchDeployedContract = (
  context: ExtensionContext,
  selectedNetwork: string
) => {
  const contracts = context.workspaceState.get("contracts") as {
    [name: string]: CompiledJSONOutput;
  };

  const contractName = Object.keys(contracts);
  const deployedContracts: Array<{
    network: string;
    address: string;
    contractName: string;
  }> = contractName.map((contract) => {
    const contractJSONOutput: CompiledJSONOutput = contracts[contract];
    const path = getContractArtifactPath(contractJSONOutput);
    const contractJsonOutput = fs.readFileSync(path, {
      encoding: "utf-8",
    });

    const parsedContractJson = JSON.parse(contractJsonOutput);
    if (parsedContractJson.deployed && !!parsedContractJson.deployed.length) {
      const isPresentOnNetwork = parsedContractJson.deployed.filter(
        (config: { network: string; address: string; contractName: string }) =>
          config.network === selectedNetwork
      );
      return isPresentOnNetwork[0];
    }
  });
  return deployedContracts;
};

export const getContractFunctions = (
  context: ExtensionContext,
  contractTitle: string
): FunctionObjectType[] | undefined => {
  const contracts = context.workspaceState.get("contracts") as {
    [name: string]: CompiledJSONOutput;
  };
  if (contractTitle === undefined) return;
  if (contracts === undefined || Object.keys(contracts).length === 0) return;

  const contractName = Object.keys(contracts).filter(
    (i: string) => i === contractTitle
  );
  const contractJSONOutput: CompiledJSONOutput = contracts[contractName[0]];

  const functionsAbi = getABIType(contractJSONOutput)?.filter(
    (i: JsonFragment) => i.type === "function"
  );
  if (functionsAbi === undefined || functionsAbi.length === 0) {
    return;
  }

  const functions: FunctionObjectType[] = functionsAbi.map(
    (e: {
      name: string;
      stateMutability: string;
      inputs: JsonFragmentType[];
      type: string;
    }) => ({
      name: e.name,
      stateMutability: e.stateMutability,
      type: e.type,
      inputs: e.inputs?.map((c) => ({ ...c, value: "" })),
    })
  );
  return functions;
};

export const executeContractFunction = async (
  context: ExtensionContext,
  contractName: string,
  contractAddress: string,
  functionObject: FunctionObjectType,
  params: string[],
  password: string,
  selectedAccount: string,
  selectedNetwork: string,
  rpcUrl: string,
  gasLimit: string,
  value?: string
) => {
  let extensionEvent: ExtensionEventTypes;
  try {
    const contracts = context.workspaceState.get("contracts") as {
      [name: string]: CompiledJSONOutput;
    };
    const contractJSONOutput: CompiledJSONOutput = contracts[contractName];

    const abi = getABIType(contractJSONOutput);
    if (abi === undefined) throw new Error("Abi is not defined.");

    const params_ = !!params.length ? params : [];

    if (params_.length !== functionObject.inputs.length) {
      let extensionEvent: ExtensionEventTypes = {
        eventStatus: "fail",
        eventType: "layer_extensionCall",
        eventResult: `Required parameters not provided.`,
      };
      ReactPanel.EmitExtensionEvent(extensionEvent);
      return;
    }

    ReactPanel.EmitExtensionEvent({
      eventStatus: "success",
      eventType: "layer_msg",
      eventResult: `Calling ${functionObject.name}`,
    });

    const gasPrice = await getLatestGasPrice(rpcUrl);

    if (
      functionObject.stateMutability === "view" ||
      functionObject.stateMutability === "pure"
    ) {
      console.log("view executed");
      const contract = new ethers.Contract(
        contractAddress,
        abi,
        getSelectedNetworkProvider(rpcUrl)
      );

      const result = await contract[functionObject.name as string](...params_, {
        gasPrice: gasPrice,
        gasLimit: gasLimit,
      });
      extensionEvent = {
        eventStatus: "success",
        eventType: "layer_extensionCall",
        eventResult: JSON.stringify(result),
      };
    } else {
      const contract = await getSignedContract(
        context,
        contractName,
        contractAddress,
        password,
        selectedAccount,
        selectedNetwork,
        rpcUrl
      );
      let result;

      if (contract !== undefined) {
        if (functionObject.stateMutability === "nonpayable") {
          result = await contract[functionObject.name as string](...params_, {
            gasPrice: gasPrice,
            gasLimit: gasLimit,
          });
        }
        if (functionObject.stateMutability === "payable") {
          result = await contract[functionObject.name as string](...params_, {
            value: value,
            gasPrice: gasPrice,
            gasLimit: gasLimit,
          });
        }
        const submittedTx = await result.wait();
        extensionEvent = {
          eventStatus: "success",
          eventType: "layer_mutableCall",
          eventResult: generateTxnInterface(submittedTx),
        };
      } else {
        return;
      }
    }
    return extensionEvent;
  } catch (error: any) {
    extensionEvent = {
      eventStatus: "fail",
      eventType: "layer_extensionCall",
      eventResult: error.body,
    };
    return extensionEvent;
  }
};
