import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type PostDocument = Post & Document;

@Schema()
export class Post {
  @Prop({ required: true })
  contentUrl: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  creator: string;

  @Prop({ type: Types.ObjectId, ref: 'Category' }) //Will eventually be made required
  category: string;

  @Prop({ type: Types.ObjectId, ref: 'Group' })
  group: string;

  // @Prop([{ type: Types.ObjectId, ref: 'User' }])
  // likes: string[];

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: false })
  isAdminDeleted: boolean;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
PostSchema.index(
  {
    contentUrl: 'text',
    description: 'text',
    creator: 'text',
    _id: 'text',
  },
  {
    weights: {
      contentUrl: 5,
      description: 3,
      creator: 3,
      _id: 1,
    },
  },
);
