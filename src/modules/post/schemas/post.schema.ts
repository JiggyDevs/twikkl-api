import { User } from './../../user/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type PostDocument = HydratedDocument<Post>;

@Schema()
export class Post {
  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  caption: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  author: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Group', default: null })
  group: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }])
  likes: string[];

  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post' })
  // replyTo: Post;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: false })
  isAdminDeleted: boolean;
}

export const PostSchema = SchemaFactory.createForClass(Post);
