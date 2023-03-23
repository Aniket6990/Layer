import { ethers } from "ethers";

const containOnlyDigits = (value: string) => {
  return /^[0-9]+(\.)?[0-9]*$/.test(value);
};

const isValidAddress = (address: string) => {
  return ethers.utils.isAddress(address);
};

const shortenText = (text: string, charStart: number, charEnd: number) => {
  return `${text.slice(0, charStart + 2)}...${text.slice(-charEnd)}`;
};
export { containOnlyDigits, isValidAddress, shortenText };

export const isLocalNetwork = (network: string) => {
  if (network === "Hardhat Network" || network === "Ganache Network")
    return true;
  return false;
};
