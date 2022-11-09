import { BigNumber } from "ethers";

export const convertToBigNum = number => {
  return number === "" ? BigNumber.from(0) : BigNumber.from(number);
};
