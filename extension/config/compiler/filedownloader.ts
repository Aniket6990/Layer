import * as fs from "fs";
import path from "path";
import * as https from "https";
import versions from "./versions";
import { ExtensionEventTypes } from "../../types";
import { ReactPanel } from "../../panels/ReactPanel";

export const downloadCompilationFile = (
  version: string,
  path: string
): Promise<void> => {
  const file = fs.createWriteStream(path);
  const url =
    "https://binaries.soliditylang.org/bin/soljson-" + version + ".js";

  ReactPanel.EmitExtensionEvent({
    eventStatus: "success",
    eventType: "layer_msg",
    eventResult: `Downloading the compiler ${version}...`,
  });
  return new Promise((resolve, reject) => {
    const request = https
      .get(url, function (response: any) {
        if (response.statusCode !== 200) {
          reject(
            ReactPanel.EmitExtensionEvent({
              eventStatus: "fail",
              eventType: "layer_msg",
              eventResult:
                "Error retrieving solidity compiler: " + response.statusMessage,
            })
          );
        } else {
          response.pipe(file);
          file.on("finish", function () {
            file.close();
            resolve();
          });
        }
      })
      .on("error", function (error) {
        fs.unlink(path, () => {
          ReactPanel.EmitExtensionEvent({
            eventStatus: "fail",
            eventType: "layer_msg",
            eventResult: "Error retrieving solidity compiler.",
          });
        });
        reject(error);
      });
    request.end();
  });
};

export const downloadRemoteVersion = async (
  folderPath: string,
  compilerVersion: string
): Promise<any> => {
  let extensionEvent: ExtensionEventTypes = {
    eventStatus: "success",
    eventType: "layer_extensionCall",
    eventResult: "",
  };

  try {
    const releases: any = versions;

    let version = "";

    const value: string = releases[compilerVersion];
    if (value !== "undefined") {
      version = value.replace("soljson-", "");
      version = version.replace(".js", "");
    }
    const pathVersion = path.resolve(
      path.join(folderPath, "soljson-" + version + ".js")
    );
    await downloadCompilationFile(version, pathVersion);
    extensionEvent.eventResult = "Compiler downloaded: " + pathVersion;
    ReactPanel.EmitExtensionEvent(extensionEvent);
    return pathVersion;
  } catch (e) {
    extensionEvent = {
      eventStatus: "fail",
      eventType: "layer_extensionCall",
      eventResult: "Error downloading compiler: " + e,
    };
    ReactPanel.EmitExtensionEvent(extensionEvent);
  }
};
