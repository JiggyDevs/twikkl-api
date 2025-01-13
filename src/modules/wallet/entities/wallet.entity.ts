import { Mnemonic } from 'ethers/lib/utils';

export class Wallet {
  address: string;
  privateKey: string;
  // pin: string;
  owner: string;
  name: string;
  balance: number;
  // recoveryPhrase: Mnemonic;
  recoveryPhrase: string;
  walletId: string;
  networkId: string;
  createdAt: Date;
  updatedAt: Date;
}
