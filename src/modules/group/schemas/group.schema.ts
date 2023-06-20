import { User } from '../../user/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type GroupDocument = HydratedDocument<Group>;

@Schema()
export class Group {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  coverImg: string;

  @Prop({ type: String })
  avatar: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: User;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  members: string[];

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: false })
  isAdminDeleted: boolean;
}

export const GroupSchema = SchemaFactory.createForClass(Group);