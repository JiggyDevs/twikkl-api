import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type FavoriteGroupsDocument = Document & FavoriteGroups;

@Schema()
export class FavoriteGroups {
  @Prop({ type: Types.ObjectId, ref: 'Group', required: true })
  group: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const FavoriteGroupSchema = SchemaFactory.createForClass(FavoriteGroups);
