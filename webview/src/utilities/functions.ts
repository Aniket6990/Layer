import { ethers } from "ethers";

const containOnlyDigits = (value: string) => {
  return /^[0-9]+(\.)?[0-9]*$/.test(value);
};

const isValidAddress = (address: string) => {
  return ethers.utils.isAddress(address);
};

export { containOnlyDigits, isValidAddress };
