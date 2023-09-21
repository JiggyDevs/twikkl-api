import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type TagsDocument = Document & Tags;

@Schema()
export class Tags {
  @Prop({ unique: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'Post' })
  post: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const TagsSchema = SchemaFactory.createForClass(Tags);
