import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ unique: true })
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

  @Prop({ default: true })
  likesNotification: boolean;

  @Prop({ default: true })
  commentsNotification: boolean;

  @Prop({ default: true })
  followersNotification: boolean;

  @Prop({ default: true })
  mentionsNotification: boolean;

  @Prop({ default: true })
  repostNotification: boolean;

  @Prop({ default: true })
  active: boolean;

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

UserSchema.pre('save', async function (next) {
  // Only generate a username if it's not provided
  if (!this.username) {
    // Generate a unique username based on the email (you can use any logic you prefer)
    const emailParts = this.email.split('@');
    const generatedUsername =
      emailParts[0]?.toLowerCase() + Math.floor(Math.random() * 1000);

    this.username = generatedUsername;
  }

  // Continue with the save operation
  next();
});
