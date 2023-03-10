import * as vscode from "vscode";
import * as fs from "fs";
import { getConfiguration } from "./network";

export const networkConfig = async () => {
  try {
    const networks = getConfiguration().get("networks") as Object;
    return networks;
  } catch (error) {
    console.log(error);
  }
};

export const addNetwork = (
  path: string,
  networkTitle: string,
  rpc: string,
  blockScanner: string,
  chainId: string,
  currencySymbol: string,
  decimals: string
) => {
  try {
    if (fs.existsSync(`${path}/networks.json`)) {
      const networks = fs.readFileSync(`${path}/networks.json`, {
        encoding: "utf-8",
      });
      const parsedNetworksObject = JSON.parse(networks);
      const addNetwork = {
        ...parsedNetworksObject,
        [`${networkTitle}`]: `{\"rpc\": \"${rpc}\", \"blockScanner\": \"${blockScanner}\",\"chainID\": \"${chainId}\", \"nativeCurrency\": {\"symbol\":\"${currencySymbol}\",\"decimals\": \"${decimals}\"}}`,
      };
      const addNewNetwork = JSON.parse(JSON.stringify(addNetwork));
      fs.writeFileSync(`${path}/networks.json`, JSON.stringify(addNewNetwork));
    } else {
      const networks = getConfiguration().get("networks") as Object;
      const addNetwork = {
        ...networks,
        ["New network"]: `{\"rpc\": \`${rpc}\`, \"blockScanner\": \"${blockScanner}\",\"chainID\": \"${chainId}\", \"nativeCurrency\": {\"symbol\":\"${currencySymbol}\",\"decimals\": \"${decimals}\"}}`,
      };
      const addNewNetwork = JSON.parse(JSON.stringify(addNetwork));
      fs.writeFileSync(`${path}/networks.json`, JSON.stringify(addNewNetwork));
    }
  } catch (error) {
    console.log("error while writing to a file", error);
  }
};
