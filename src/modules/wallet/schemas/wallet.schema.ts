import { WalletType } from '@getpara/server-sdk';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document, Types } from 'mongoose';

export type WalletDocument = Wallet & Document;

@Schema()
export class Wallet {
  @Prop({ type: String, default: 'Main wallet' })
  name: string;

  // @Prop({ type: Array<string>, required: true })
  // recoveryPhrase: Mnemonic;

  @Prop({ type: String, default: '' })
  recoveryPhrase: string;

  @Prop({ type: String, required: true })
  address: string;

  @Prop({ type: String, default: '' })
  privateKey: string;

  @Prop({ type: String })
  publicKey: string;

  @Prop({ type: String })
  customAuthIdId: string;

  @Prop({
    type: String,
    enum: ['EVM', 'SOLANA', 'COSMOS'],
  })
  type: string;

  @Prop({ type: Number, default: 0 })
  balance: number;

  @Prop({ type: String, required: true })
  walletId: string;

  @Prop({ type: String, required: true })
  keyShare: string;

  @Prop({ type: String })
  networkId: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
