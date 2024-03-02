import { Mnemonic } from 'ethers/lib/utils';

export class Wallet {
  address: string;
  privateKey: string;
  pin: string;
  owner: string;
  name: string;
  balance: number;
  recoveryPhrase: Mnemonic;
  //   createdAt: Date;
  //   updatedAt: Date;
}
