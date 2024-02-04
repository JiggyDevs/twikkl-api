import { User } from '../../user/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type WalletDocument = Wallet & Document;

@Schema()
export class Wallet {
  @Prop({ type: String, required: true })
  pin: string;

  @Prop({ type: String, required: true })
  address: string;

  @Prop({ type: String, required: true })
  privateKey: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: string;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
