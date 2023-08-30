import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema()
export class Notification {
  @Prop()
  title: string;

  @Prop()
  content: string;

  @Prop({ default: false })
  clicked: boolean;

  @Prop()
  type: string;

  @Prop()
  link?: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
