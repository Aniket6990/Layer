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
} from "../config";
import { getUri } from "../utilities/getUri";

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
        "ETHcode-layer",
        // The editor column the panel should be displayed in
        ViewColumn.One,
        // Extra panel configurations
        {
          // Enable JavaScript in the webview
          enableScripts: true,
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
      getUri(context, ["webview", "build", "static", "js", "main.js"])
    );

    return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
          <meta name="theme-color" content="#000000">
          <title>ETHcode-layer</title>
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
              data: await networkConfig(),
            });
            break;
          }
          case "get-account-list": {
            webview.postMessage({
              command: "post-account-list",
              data: await listAddresses(context, context.extensionPath),
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
            webview.postMessage({
              command: "imported-account-key",
              data: createAccountFromKey(
                context,
                context.extensionPath,
                password,
                pvtKey
              ),
            });
            break;
          }
        }
      },
      undefined,
      this._disposables
    );
  }
}
