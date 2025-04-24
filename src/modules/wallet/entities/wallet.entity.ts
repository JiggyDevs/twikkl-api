import { WalletEntity } from '@getpara/server-sdk';

export class Wallet {
  name: string;
  owner: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
  keyShare: string;
  walletId: string;
  publicKey: string;
  customAuthIdId: string;
  type: WalletEntity['type'];
  // pin: string;
  // recoveryPhrase: Mnemonic;
  balance: number;
  privateKey: string;
  recoveryPhrase: string;
  networkId: string;
}
