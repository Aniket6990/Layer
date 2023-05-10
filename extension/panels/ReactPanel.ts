import {
  Disposable,
  Webview,
  WebviewPanel,
  window,
  Uri,
  ViewColumn,
  ExtensionContext,
} from "vscode";
import {
  listAddresses,
  createNewKeyPair,
  displayAccountBalance,
  networkConfig,
  createAccountFromKey,
  importNewKeyPair,
  exportPvtKeyPair,
  exportPvtKeyPairFile,
  sendTransaction,
  unlockSelectedAccount,
} from "../config";
import {
  deploySelectedContract,
  executeContractFunction,
  fetchDeployedContract,
  getContractConstructor,
  getContractFunctions,
  loadAllCompiledContracts,
} from "../config/contract";
import { addNetwork, deleteNetwork } from "../config/ext-config";
import {
  ConstructorInputValue,
  ExtensionEventTypes,
  JsonFragmentType,
} from "../types";
import { getUri } from "../utilities/getUri";
import {
  getCompilerVersions,
  loadCompiler,
  loadSolidityContracts,
} from "../config/compiler/solcompiler";

export class ReactPanel {
  public static currentPanel: ReactPanel | undefined;
  private readonly _panel: WebviewPanel;
  private _disposables: Disposable[] = [];

  private constructor(panel: WebviewPanel, context: ExtensionContext) {
    this._panel = panel;

    // Set an event listener to listen for when the panel is disposed (i.e. when the user closes
    // the panel or when the panel is closed programmatically)
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    // Set the HTML content for the webview panel
    this._panel.webview.html = this._getWebviewContent(context);

    // Set an event listener to listen for messages passed from the webview context
    this._setWebviewMessageListener(this._panel.webview, context);
  }

  /**
   * Renders the current webview panel if it exists otherwise a new webview panel
   * will be created and displayed.
   *
   */
  public static render(context: ExtensionContext) {
    if (ReactPanel.currentPanel) {
      // If the webview panel already exists reveal it
      ReactPanel.currentPanel._panel.reveal(ViewColumn.One);
    } else {
      // If a webview panel does not already exist create and show a new one
      const panel = window.createWebviewPanel(
        // Panel view type
        "showHelloWorld",
        // Panel title
        "Layer",
        // The editor column the panel should be displayed in
        ViewColumn.One,
        // Extra panel configurations
        {
          // Enable JavaScript in the webview
          enableScripts: true,
          retainContextWhenHidden: true,
        }
      );

      ReactPanel.currentPanel = new ReactPanel(panel, context);
    }
  }

  /**
   * Cleans up and disposes of webview resources when the webview panel is closed.
   */
  public dispose() {
    ReactPanel.currentPanel = undefined;

    // Dispose of the current webview panel
    this._panel.dispose();

    // Dispose of all disposables (i.e. commands) for the current webview panel
    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }

  /**
   * Defines and returns the HTML that should be rendered within the webview panel.
   * This is also the place where references to the React webview build files
   * are created and inserted into the webview HTML.
   */
  private _getWebviewContent(context: ExtensionContext) {
    // The JS file from the React build output
    const scriptUri = this._panel.webview.asWebviewUri(
      getUri(context, ["webview_build", "static", "js", "main.js"])
    );

    return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
          <meta name="theme-color" content="#000000">
          <title>Layer</title>
        </head>
        <body>
          <noscript>You need to enable JavaScript to run this app.</noscript>
          <div id="root"></div>
          <script src="${scriptUri}"></script>
        </body>
      </html>
    `;
  }

  /**
   * Sets up an event listener to listen for messages passed from the webview context and
   * executes code based on the message that is recieved.
   */
  private _setWebviewMessageListener(
    webview: Webview,
    context: ExtensionContext
  ) {
    webview.onDidReceiveMessage(
      async (message: any) => {
        const command = message.command;
        switch (command) {
          case "get-network-list": {
            webview.postMessage({
              command: "post-network-list",
              data: await networkConfig(context.extensionPath),
            });
            break;
          }
          case "get-account-list": {
            const { networkName, rpcUrl } = message.data;
            if (networkName !== undefined && rpcUrl !== undefined) {
              webview.postMessage({
                command: "post-account-list",
                data: await listAddresses(
                  context.extensionPath,
                  networkName,
                  rpcUrl
                ),
              });
            } else {
              webview.postMessage({
                command: "post-account-list",
                data: await listAddresses(context.extensionPath),
              });
            }

            break;
          }
          case "get-wallet-account-list": {
            webview.postMessage({
              command: "post-wallet-account-list",
              data: await listAddresses(context.extensionPath),
            });

            break;
          }
          case "create-new-keypair": {
            const password: string = message.data;
            webview.postMessage({
              command: "new-keypair-created",
              data: createNewKeyPair(context, context.extensionPath, password),
            });
            break;
          }
          case "get-account-balance": {
            const { selectedAccount, selectedNetworkRpcUrl } = message.data;
            webview.postMessage({
              command: "post-account-balance",
              data: await displayAccountBalance(
                selectedAccount,
                selectedNetworkRpcUrl
              ),
            });
            break;
          }
          case "get-wallet-balance": {
            const { selectedAccount, selectedNetworkRpcUrl } = message.data;
            webview.postMessage({
              command: "post-wallet-balance",
              data: await displayAccountBalance(
                selectedAccount,
                selectedNetworkRpcUrl
              ),
            });
            break;
          }
          case "import-account-key": {
            const { pvtKey, password } = message.data;
            const importData = await createAccountFromKey(
              context,
              context.extensionPath,
              password,
              pvtKey
            );
            webview.postMessage({
              command: "imported-account-key",
              data: importData,
            });
            break;
          }
          case "import-account": {
            const importData = await importNewKeyPair(context);
            webview.postMessage({
              command: "imported-account",
              data: importData,
            });
            break;
          }
          case "export-account-key": {
            const { walletSelectedAccount, pswd } = message.data;
            const pvtKey = await exportPvtKeyPair(
              context,
              walletSelectedAccount,
              pswd
            );
            webview.postMessage({
              command: "exported-account-key",
              data: pvtKey,
            });
            break;
          }
          case "export-account": {
            const { walletSelectedAccount } = message.data;
            const msg = await exportPvtKeyPairFile(
              context,
              walletSelectedAccount
            );
            webview.postMessage({
              command: "exported-account",
              data: msg,
            });
            break;
          }
          case "send-token": {
            const { txObject } = message.data;
            const msg = await sendTransaction(context, txObject);
            webview.postMessage({
              command: "send-token-result",
              data: msg,
            });
            break;
          }
          case "get-solidity-contracts": {
            const solidityContracts = loadSolidityContracts();
            if (solidityContracts !== undefined) {
              webview.postMessage({
                command: "post-solidity-contracts",
                data: solidityContracts,
              });
            }
            break;
          }
          case "get-compiled-contracts": {
            const compiledContracts = loadAllCompiledContracts(context);
            if (compiledContracts !== undefined) {
              webview.postMessage({
                command: "post-compiled-contracts",
                data: compiledContracts,
              });
            }
            break;
          }
          case "get-contract-constructor": {
            const { contractTitle } = message.data;
            const constructorInputs = getContractConstructor(
              context,
              contractTitle
            );
            webview.postMessage({
              command: "post-contract-constructor",
              data: constructorInputs,
            });
            break;
          }
          case "deploy-contract": {
            const {
              contractName,
              params,
              password,
              selectedNetwork,
              selectedAccount,
              rpcURL,
              gasLimit,
              value,
            } = message.data;
            const deploymentResult = await deploySelectedContract(
              context,
              contractName,
              params,
              password,
              selectedNetwork,
              selectedAccount,
              rpcURL,
              gasLimit,
              value
            );
            if (deploymentResult !== undefined) {
              webview.postMessage({
                command: "contract-deployed",
                data: deploymentResult,
              });
            }
            break;
          }
          case "get-deployed-contracts": {
            const { selectedNetwork } = message.data;
            const deployedContracts = fetchDeployedContract(
              context,
              selectedNetwork
            );
            webview.postMessage({
              command: "post-deployed-contracts",
              data: deployedContracts,
            });
            break;
          }
          case "get-contract-functions": {
            const { contractTitle } = message.data;
            const contractFunctions = getContractFunctions(
              context,
              contractTitle
            );
            webview.postMessage({
              command: "post-contract-functions",
              data: contractFunctions,
            });
            break;
          }
          case "execute-function": {
            const {
              contractName,
              contractAddress,
              functionObject,
              params,
              password,
              selectedAccount,
              selectedNetwork,
              rpcUrl,
              gasLimit,
              value,
            } = message.data;
            const contractExecution = await executeContractFunction(
              context,
              contractName,
              contractAddress,
              functionObject,
              params,
              password,
              selectedAccount,
              selectedNetwork,
              rpcUrl,
              gasLimit,
              value
            );
            webview.postMessage({
              command: "function-executed",
              data: contractExecution,
            });
            break;
          }
          case "add-network": {
            const { networkTitle, networkInfo } = message.data;
            const status = addNetwork(
              context.extensionPath,
              networkTitle,
              networkInfo
            );
            webview.postMessage({
              command: "network-added",
              data: status,
            });
            break;
          }
          case "delete-network": {
            const { networkTitle } = message.data;
            const status = deleteNetwork(context.extensionPath, networkTitle);
            webview.postMessage({
              command: "network-deleted",
              data: status,
            });
            break;
          }
          case "unlock-account": {
            const { accountAddress, pswd } = message.data;
            const status = await unlockSelectedAccount(
              context,
              accountAddress,
              pswd
            );
            webview.postMessage({
              command: "account-unlocked",
              data: status,
            });
            break;
          }
          case "compile-contract": {
            const { contractPath, compilerVersion } = message.data;
            await loadCompiler(context, contractPath, compilerVersion);
            break;
          }
          case "load-compiler-versions": {
            const versions = getCompilerVersions();
            webview.postMessage({
              command: "post-compiler-versions",
              data: versions,
            });
            break;
          }
        }
      },
      undefined,
      this._disposables
    );
  }

  public static EmitExtensionEvent(result: ExtensionEventTypes) {
    let webview = this.currentPanel?._panel.webview as Webview;
    webview.postMessage({
      command: "extension-event",
      data: result,
    });
  }
}
