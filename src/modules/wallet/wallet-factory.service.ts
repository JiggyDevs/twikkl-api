import { Injectable } from '@nestjs/common';
import { OptionalQuery } from 'src/core/types/database';
import { Wallet } from './entities/wallet.entity';

@Injectable()
export class WalletFactoryService {
  create(data: OptionalQuery<Wallet>) {
    const wallet = new Wallet();
    if (data.name) wallet.name = data.name;
    if (data.type) wallet.type = data.type;
    if (data.owner) wallet.owner = data.owner;
    if (data.address) wallet.address = data.address;
    if (data.keyShare) wallet.keyShare = data.keyShare;
    if (data.walletId) wallet.walletId = data.walletId;
    if (data.publicKey) wallet.publicKey = data.publicKey;
    if (data.customAuthIdId) wallet.customAuthIdId = data.customAuthIdId;
    // if (data.networkId) wallet.networkId = data.networkId;
    // if (data.privateKey) wallet.privateKey = data.privateKey;

    // if (data.recoveryPhrase) wallet.recoveryPhrase = data.recoveryPhrase;
    if (data.createdAt) wallet.createdAt = data.createdAt;
    if (data.updatedAt) wallet.updatedAt = data.updatedAt;

    return wallet;
  }
}
