import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CommentDocument = Comment & Document;

@Schema()
export class Comment {
  @Prop({ required: true })
  comment: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: string;

  @Prop({ type: Types.ObjectId, ref: 'Post', required: true })
  post: string;

  @Prop({ type: Types.ObjectId, ref: 'Comment' })
  replyTo: string;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: false })
  isAdminDeleted: boolean;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
