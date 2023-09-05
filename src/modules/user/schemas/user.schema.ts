import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ default: "", unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  following: string[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Group' }] })
  groups: string[]; // Array of group IDs that the user is a member of

  @Prop()
  lastLoginDate: Date;

  @Prop()
  avatar: string;

  @Prop()
  bio: string;

  @Prop()
  twitter: string;

  @Prop()
  deviceToken: string;

  @Prop({ default: false })
  emailVerified: boolean;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index(
  {
    userName: 'text',
    email: 'text',
    _id: 'text',
  },
  {
    weights: {
      userName: 5,
      email: 3,
      _id: 1,
    },
  },
);
