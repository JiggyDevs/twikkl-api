import { Injectable } from '@nestjs/common';
import { OptionalQuery } from 'src/core/types/database';
import { Wallet } from './entities/wallet.entity';

@Injectable()
export class WalletFactoryService {
  create(data: OptionalQuery<Wallet>) {
    const wallet = new Wallet();
    if (data.address) wallet.address = data.address;
    if (data.networkId) wallet.networkId = data.networkId;
    if (data.walletId) wallet.walletId = data.walletId;
    if (data.privateKey) wallet.privateKey = data.privateKey;
    if (data.owner) wallet.owner = data.owner;
    if (data.recoveryPhrase) wallet.recoveryPhrase = data.recoveryPhrase;
    if (data.createdAt) wallet.createdAt = data.createdAt;
    if (data.updatedAt) wallet.updatedAt = data.updatedAt;

    return wallet;
  }
}
