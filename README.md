`Layer solidity` is a VScode extension that helps in doing interaction with smart contracts written in solidity right from the window of VScode.

## Installation

VisualStudio Marketplace - [https://marketplace.visualstudio.com/items?itemName=Chaintown.layer)

## Usage

`Layer solidity` is designed to provide easy to use interface for a smart contract developer to interact with a smart contract compiled in any framework quickly. To interact with the smart contracts written in solidity follow the below guide:

### **Guide to interacting with smart contracts written in solidity**

Currently, `Layer solidity` extension supports only Hardhat compiled contracts. Other framework support will be rolled out soon.

But for now, you can only interact with solidity smart contracts compiled using Hardhat using `Layer solidity`. To start interacting with smart contracts open your hardhat project and fellow the below steps:

1. **Activate the extension:** Activate the extension by clicking on the extension icon visible in the activity bar. \*\*\*\*

   A button with the title `work with solidity` will be shown in the sidebar to activate the [Layer solidity](https://marketplace.visualstudio.com/items?itemName=Chaintown.layer) extension. Click on this button to start working with smart contracts written in solidity.

2. **Select Network:** Select the Network on which you want to deploy the smart contract and execute the functions available in the smart contracts.
3. **Select Ethereum address:** This will help in signing the transactions while performing smart contract deployment and execution.

   Unlock the account it will help in signing the transactions because all the accounts are password protected.

   if no account is available follow this guide to create a new one before going forward.

4. **Deploy compiled contract:** All the compiled smart contracts that are present in the `artifacts/contracts` folder will be visible in the dropdown.

   if no complied contract is present then compile the contract using `npx hardhat compile` and then click on the refresh button.

   Then select the smart contract that you want to deploy on the selected network. pass all the required constructor parameters if present.

   click on deploy.

5. **Select deployed contract:** Select the deployed contract from the dropdown that is deployed on the selected network.

   All the functions that are available in the smart contracts will be visible after selecting the contract. Just enter the required parameter in the input and click on the `functionName` button to execute the function.

   ![contract](https://user-images.githubusercontent.com/87822922/227707118-e3dc897e-aeda-4603-b782-dc22c870d2cb.gif)

### Guide to Creating New Account

Accounts are a very essential feature to sign and create transactions for smart contract deployment and execution. `Layer` accounts can be created in three ways:

1. **Create New Account:** You can create a new account by just entering the password. This will make your account password protected to prevent transaction signing from bad actors.

   Enter the password to create a new account in `create account` section of the wallet page. After entering the password click on the `create` button.

   ![account3](https://user-images.githubusercontent.com/87822922/227707791-64c25abb-68ce-4df0-8e49-799c7620ec1e.gif)

2. **Import account using private key:** Accounts that you use on other wallets like metamask can also be used in the extension to interact with the smart contracts. Accounts can be imported by just pasting the private key in the `import account` section of the wallet page.

   After entering the private key you have to make your account password protected to prevent transaction signing from bad actors.

   After entering the password click on the `+` button to add the new account to the extension environment.

   ![account1](https://user-images.githubusercontent.com/87822922/227707811-d2c619b1-6cf1-4121-b955-c07d212fc74a.gif)

3. **Import using keystore file:** `Layer` follows the account standard that is used by Geth. You can also import your account by using the Keystore file.

   To import an account that is available as keystore click on the `From JSON` button in the import account section and select the keystore file.

   ![account2](https://user-images.githubusercontent.com/87822922/227707824-1bd959b1-d930-4e43-80cb-1cf35e6beb2c.gif)

### Guide to Export Account

Ethereum addresses that you are using on the `Layer` can also be exported. This will help in using the same account on other wallets too.

Accounts can be exported in two ways:

1. **Export private key:** To export the account private key just select the account on the wallet page. \*\*\*\*After selecting the account just enter the account password in the `Export account` section of the wallet then click on the button to see the private key.

![account4](https://user-images.githubusercontent.com/87822922/227708291-4e5b1083-79b0-414d-bcb8-176633522629.gif)

2. **Export Keystore file:** To export the account in keystore format click on `Export JSON` button and then select the directory in which you want to save the keystore file.

![account5](https://user-images.githubusercontent.com/87822922/227708313-07dac380-9401-49a6-b414-ad6d52700ae1.gif)

### Guide to adding a new network

`Layer` provide default supports for `Ethereum, Goerli testnet, Sepolia testnet, Polygon mainnet, Polygon Mumbai, Hardhat Network, Ganache Network` networks.

But you can also add other networks to interact with smart contracts. To add other networks in the extension environment follow the below steps:

1. Navigate to the settings page.
2. Select `Add New Network` button on the left panel.
3. After clicking add the new network configurations like `Network name, rpc url, blockscanner url, chainId, token symbol, token decimal` on the left panel.
4. click the `save` button.

The new network will be added to the extension environment and you are fully prepared to interact with your solidity smart contract on the new network.

Note: You can also replace `rpc url` of default networks with your custom Infura or Alchemy rpc url to make contract interaction faster.
