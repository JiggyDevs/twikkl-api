import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AdminRole, AdminStatus } from '../admin.type';

export type AdminDocument = Admin & Document;

@Schema()
export class Admin {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ unique: true })
  phone: string;

  @Prop()
  password: string;

  @Prop({ default: AdminStatus.PENDING })
  status: string;

  @Prop({ default: AdminRole.ADMIN })
  role: string;

  @Prop()
  image: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
