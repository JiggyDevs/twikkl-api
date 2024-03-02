import { User } from '../../user/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Mnemonic } from 'ethers/lib/utils';
import { Document, Types } from 'mongoose';

export type WalletDocument = Wallet & Document;

@Schema()
export class Wallet {
  @Prop({ type: String, default: 'Wallet 1' })
  name: string;

  @Prop({ type: Array<string>, required: true })
  recoveryPhrase: Mnemonic;

  @Prop({ type: String, required: true })
  pin: string;

  @Prop({ type: String, required: true })
  address: string;

  @Prop({ type: String, required: true })
  privateKey: string;

  @Prop({ type: Number, default: 0 })
  balance: number;

  //   assets: [{
  //     name: {
  //         type: String
  //     },
  //     address: {
  //         type: String
  //     },
  //     quantity: {
  //         type: Schema.Types.Decimal128,
  //         default: 0,
  //         get: (v: Schema.Types.Decimal128): string => (+v.toString()).toFixed(2)
  //     },
  //     unit: {
  //         type: String
  //     }
  // }],

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: string;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
