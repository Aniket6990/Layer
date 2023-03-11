import * as vscode from "vscode";
import * as fs from "fs";
import { getConfiguration } from "./network";
import { ExtensionEventTypes, NetworkConfig } from "../types";

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
  networkInfo: NetworkConfig
) => {
  let extensionEvent: ExtensionEventTypes;
  try {
    if (fs.existsSync(`${path}/networks.json`)) {
      const networks = fs.readFileSync(`${path}/networks.json`, {
        encoding: "utf-8",
      });
      const parsedNetworksObject = JSON.parse(networks);
      const addNetwork = {
        ...parsedNetworksObject,
        [`${networkTitle}`]: `{\"rpc\": \"${networkInfo.rpc}\", \"blockScanner\": \"${networkInfo.blockScanner}\",\"chainID\": \"${networkInfo.chainID}\", \"symbol\":\"${networkInfo.symbol}\",\"decimals\": \"${networkInfo.decimals}\", \"isDefault\": false}`,
      };
      const addNewNetwork = JSON.parse(JSON.stringify(addNetwork));
      fs.writeFileSync(`${path}/networks.json`, JSON.stringify(addNewNetwork));
    } else {
      const networks = getConfiguration().get("networks") as Object;
      const addNetwork = {
        ...networks,
        [networkTitle]: `{\"rpc\": \"${networkInfo.rpc}\", \"blockScanner\": \"${networkInfo.blockScanner}\",\"chainID\": \"${networkInfo.chainID}\", \"symbol\":\"${networkInfo.symbol}\",\"decimals\": \"${networkInfo.decimals}\", \"isDefault\": false}`,
      };
      const addNewNetwork = JSON.parse(JSON.stringify(addNetwork));
      fs.writeFileSync(`${path}/networks.json`, JSON.stringify(addNewNetwork));
    }
    extensionEvent = {
      eventStatus: "success",
      eventType: "layer_extensionCall",
      eventResult: `Saved ${networkTitle} successfully.`,
    };
    return extensionEvent;
  } catch (error) {
    extensionEvent = {
      eventStatus: "fail",
      eventType: "layer_extensionCall",
      eventResult: `Error while saving ${networkTitle}`,
    };
    return extensionEvent;
  }
};

export const deleteNetwork = (path: string, networkTitle: string) => {
  let extensionEvent: ExtensionEventTypes;
  try {
    const networks = fs.readFileSync(`${path}/networks.json`, {
      encoding: "utf-8",
    });
    const parsedNetworkData = JSON.parse(networks);
    const remainingNetworks = Object.keys(parsedNetworkData)
      .filter((key) => key !== networkTitle)
      .reduce((obj: any, key: string) => {
        obj[key] = parsedNetworkData[key];
        return obj;
      }, {});
    fs.writeFileSync(
      `${path}/networks.json`,
      JSON.stringify(remainingNetworks)
    );
    extensionEvent = {
      eventStatus: "success",
      eventType: "layer_extensionCall",
      eventResult: `deleted ${networkTitle} successfully.`,
    };
    return extensionEvent;
  } catch (error) {
    extensionEvent = {
      eventStatus: "fail",
      eventType: "layer_extensionCall",
      eventResult: `Error while deleting ${networkTitle}`,
    };
    return extensionEvent;
  }
};
