import { User } from '../../users/entities/user.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type GroupDocument = HydratedDocument<Group>;

@Schema()
export class Group {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  body: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: User;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  members: User[];

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: false })
  isAdminDeleted: boolean;
}

export const GroupSchema = SchemaFactory.createForClass(Group);