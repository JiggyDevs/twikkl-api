import { BigNumber } from "ethers";

export class MakeTransactionDto {
  pin: string;
    toAddress: string;
    amount: BigNumber
}
