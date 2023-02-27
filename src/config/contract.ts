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
import { getABIType } from "../utilities/functions";
import { JsonFragment } from "@ethersproject/abi";

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
