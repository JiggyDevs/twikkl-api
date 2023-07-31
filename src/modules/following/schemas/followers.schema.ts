import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";

export type FollowersDocument = Followers & Document

@Schema()
export class Followers {
  @Prop({ required: true })
  follower: string; 

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: string;

  @Prop()
  createdAt: Date
  
  @Prop()
  updatedAt: Date
}

export const FollowersSchema = SchemaFactory.createForClass(Followers);