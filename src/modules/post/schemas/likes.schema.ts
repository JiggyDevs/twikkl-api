import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type LikesDocument = Likes & Document

@Schema()
export class Likes {
  @Prop({ type: Types.ObjectId, ref: 'Post', required: true})
  post: string

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: string; 

  @Prop()
  createdAt: Date
  
  @Prop()
  updatedAt: Date
}

export const LikesSchema = SchemaFactory.createForClass(Likes);