import {
  VSCodeButton,
  VSCodeDropdown,
  VSCodeOption,
  VSCodeTextField,
} from "@vscode/webview-ui-toolkit/react";
import React, { useEffect, useState } from "react";
import { FaRegCopy } from "react-icons/fa";
import { GrAdd } from "react-icons/gr";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  createNewKeyPairAccount,
  exportAccountPvtKey,
  exportAccountPvtKeyFile,
  getAccounts,
  importAccount,
  importAccountFromKey,
} from "../../configuration/webviewpostmsg";
import { setEventMsg, setWalletAccount } from "../../store/extensionstore";

const ConfigContainer = styled.div`
  height: 500px;
  overflow-y: scroll;
  border-radius: 10px;
  border: 1px solid var(--vscode-icon-foreground);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 20px 0px 20px 20px;
  gap: 8px;
`;

const ConfigWrapper = styled.div`
  font-size: 12px;
  color: var(--vscode-icon-foreground);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  gap: 8px;
`;

const DropDown = styled(VSCodeDropdown)`
  font-size: 12px;
  border: 1px solid var(--vscode-icon-foreground);
`;

const FullObjectWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 0.1fr;
  grid-template-rows: 1fr;
  column-gap: 10px;
  align-items: center;
`;

const PartialObjectWrapper = styled.div`
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  grid-template-rows: 1fr;
  column-gap: 10px;
`;

const TextField = styled(VSCodeTextField)`
  font-size: 12px;
  border: 1px solid var(--vscode-icon-foreground);
`;

const CopyIcon = styled(FaRegCopy)`
  width: 16px;
  height: 16px;
  &:hover {
    cursor: pointer;
  }
`;

const ShowPvtKey = styled(AiOutlineEye)`
  width: 16px;
  height: 16px;
  &:hover {
    cursor: pointer;
  }
`;
const HidePvtKey = styled(AiOutlineEyeInvisible)`
  width: 16px;
  height: 16px;
  &:hover {
    cursor: pointer;
  }
`;
const AddIcon = styled(GrAdd)`
  width: 16px;
  height: 16px;
  background-color: var(--vscode-icon-foreground);
  &:hover {
    cursor: pointer;
  }
`;

const ErrorMessage = styled.span`
  color: red;
  font-size: 12px;
  justify-self: center;
`;

const WalletConfig = () => {
  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
  const [password, setPassword] = useState<string>("");
  const [importPvtKey, setImportPvtKey] = useState<string>("");
  const [importPswd, setImportPswd] = useState<string>("");
  const [exportPvtKey, setExportPvtKey] = useState<string>(ZERO_ADDRESS);
  const [exportPvtKeyPswd, setExportPvtKeyPswd] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [showPvtKey, setShowPvtKey] = useState<boolean>(false);
  const accounts = useAppSelector((state) => state.extension.addresses);
  const walletSelectedAccount = useAppSelector(
    (state) => state.extension.walletAccount
  );
  const dispatch = useAppDispatch();

  const handleAccountDropdownChange = (event: any) => {
    dispatch(setWalletAccount(event.target.value));
  };

  const handleImportFromPvtKey = () => {
    const pvtKey =
      importPvtKey.length === 66 ? importPvtKey.slice(2) : importPvtKey;
    if (importPswd.length >= 6 && pvtKey.length === 64) {
      setErrorMsg("");
      setImportPswd("");
      setImportPvtKey("");
      importAccountFromKey(pvtKey, importPswd);
    }
    if (importPswd.length < 6) {
      setErrorMsg("Password must be 6 characters long.");
    }
    if (importPvtKey.length < 64 || importPvtKey.length > 66) {
      setErrorMsg("Private key is not valid.");
    }
  };

  const handleCreateNewKeyPair = () => {
    if (password.length >= 6) {
      createNewKeyPairAccount(password);
      setPassword("");
    } else {
      setErrorMsg("Password must be 6 characters long.");
    }
  };

  const handleViewPvtKey = () => {
    if (exportPvtKeyPswd.length < 6 && exportPvtKey === ZERO_ADDRESS) {
      setErrorMsg("Please enter a password to view private key.");
    }
    if (
      exportPvtKeyPswd.length >= 6 &&
      walletSelectedAccount !== "Select Account"
    ) {
      setErrorMsg("");
      exportAccountPvtKey(walletSelectedAccount, exportPvtKeyPswd);
      setExportPvtKeyPswd("");
    }
    if (exportPvtKey !== ZERO_ADDRESS) {
      setShowPvtKey((prev) => !prev);
    }
    if (walletSelectedAccount === "Select Account") {
      setErrorMsg("No Account selected.");
    }
  };
  // useEffect hook to check when account is changing
  useEffect(() => {
    setExportPvtKey(ZERO_ADDRESS);
    setExportPvtKeyPswd("");
    setErrorMsg("");
    setShowPvtKey(false);
  }, [walletSelectedAccount]);

  // useEffect hook to listen to window event sent by the extension
  useEffect(() => {
    const fn = (event: any) => {
      const eventData = event.data;
      switch (eventData.command) {
        case "exported-account-key": {
          if (eventData.data.msgType !== "error") {
            setErrorMsg("");
            setExportPvtKey(eventData.data.msg);
            setShowPvtKey(true);
          } else {
            dispatch(setEventMsg(eventData.data));
            setErrorMsg(eventData.data.msg);
          }
          break;
        }
        case "exported-account": {
          if (eventData.data.msgType !== "error") {
            dispatch(setEventMsg(eventData.data));
            setErrorMsg(eventData.data.msg);
          } else {
            dispatch(setEventMsg(eventData.data));
            setErrorMsg(eventData.data.msg);
          }
          break;
        }
        default: {
          console.log("Invalid event", event.data);
          break;
        }
      }
    };
    window.addEventListener("message", fn);
    return () => {
      window.removeEventListener("message", fn);
    };
  }, []);

  return (
    <ConfigContainer>
      {/* Account selection dropdown */}
      <ConfigWrapper>
        <span>Account</span>
        <FullObjectWrapper>
          <DropDown
            value={walletSelectedAccount}
            onChange={(e: any) => {
              handleAccountDropdownChange(e);
            }}
          >
            <VSCodeOption value="Select Account">Select Account</VSCodeOption>
            {accounts.map((account, index) => {
              return (
                <VSCodeOption key={index} value={account}>
                  {account}
                </VSCodeOption>
              );
            })}
          </DropDown>
          <CopyIcon></CopyIcon>
        </FullObjectWrapper>
      </ConfigWrapper>
      {/* Import account field */}
      <ConfigWrapper>
        <span>Import Account</span>
        <FullObjectWrapper>
          <PartialObjectWrapper>
            <TextField
              placeholder="Private Key"
              type="text"
              value={importPvtKey}
              onChange={(e: any) => {
                setImportPvtKey(e.target.value);
              }}
            ></TextField>
            <TextField
              placeholder="Password"
              type="password"
              value={importPswd}
              onChange={(e: any) => {
                setImportPswd(e.target.value);
              }}
            ></TextField>
          </PartialObjectWrapper>
          <AddIcon
            onClick={(e) => {
              handleImportFromPvtKey();
            }}
          ></AddIcon>
        </FullObjectWrapper>
        <span>OR</span>
        <FullObjectWrapper>
          <VSCodeButton
            onClick={(e) => {
              importAccount();
            }}
          >
            From JSON
          </VSCodeButton>
        </FullObjectWrapper>
      </ConfigWrapper>
      {/* Export account field */}
      <ConfigWrapper>
        <span>Export Account</span>
        <FullObjectWrapper>
          <PartialObjectWrapper>
            <TextField
              placeHolder="Private Key"
              type={showPvtKey ? "text" : "password"}
              value={
                walletSelectedAccount !== "Select Account" ? exportPvtKey : null
              }
            ></TextField>
            <TextField
              placeholder="Password"
              type="password"
              value={exportPvtKeyPswd}
              onChange={(e: any) => {
                setExportPvtKeyPswd(e.target.value);
              }}
            ></TextField>
          </PartialObjectWrapper>
          {showPvtKey ? (
            <ShowPvtKey
              onClick={(e) => {
                handleViewPvtKey();
              }}
            ></ShowPvtKey>
          ) : (
            <HidePvtKey
              onClick={(e) => {
                handleViewPvtKey();
              }}
            ></HidePvtKey>
          )}
        </FullObjectWrapper>
        <span>OR</span>
        <FullObjectWrapper>
          <VSCodeButton
            onClick={(e) => {
              if (walletSelectedAccount !== "Select Account") {
                setErrorMsg("");
                exportAccountPvtKeyFile(walletSelectedAccount);
              } else {
                setErrorMsg("Please select account to export.");
              }
            }}
          >
            Export JSON
          </VSCodeButton>
        </FullObjectWrapper>
      </ConfigWrapper>
      {/* Create new account field */}
      <ConfigWrapper>
        <span>Create account</span>
        <FullObjectWrapper>
          <PartialObjectWrapper>
            <TextField
              placeholder="password"
              type="password"
              value={password}
              onChange={(e: any) => {
                setPassword(e.target.value);
              }}
            ></TextField>
            <VSCodeButton
              onClick={(e) => {
                handleCreateNewKeyPair();
                getAccounts();
              }}
            >
              Create
            </VSCodeButton>
          </PartialObjectWrapper>
        </FullObjectWrapper>
      </ConfigWrapper>
      {errorMsg !== "" ? <ErrorMessage>{errorMsg}</ErrorMessage> : null}
    </ConfigContainer>
  );
};

export default WalletConfig;
