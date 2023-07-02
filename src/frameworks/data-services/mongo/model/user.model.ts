import {
    Prop,
    Schema,
    SchemaFactory
  } from '@nestjs/mongoose';
//   import * as mongoose from 'mongoose';
  import {
    API_VERSIONS,
    API_VERSION_LIST,
    DEVICES,
    DEVICE_TYPE,
    USER_LOCK,
    USER_LOCK_LIST,
    USER_SIGNUP_STATUS_TYPE,
    USER_SIGNUP_STATUS_TYPE_LIST,
    USER_TYPE,
    USER_TYPE_LIST,
    VERIFICATION_VALUE_TYPE,
    VERIFICATION_VALUE_TYPE_LIST
  } from 'src/lib/constants';
  
  export type UserDocument = User & Document;
  
  @Schema()
  export class User {
    @Prop()
    firstName: string;
  
    @Prop()
    lastName: string;
  
    @Prop({ required: true })
    email: string;
  
    @Prop({
      required: true,
      enum: DEVICES,
    })
    device: DEVICE_TYPE
  
    @Prop()
    deviceToken?: string
  
    @Prop()
    password: string
  
    @Prop({ enum: VERIFICATION_VALUE_TYPE_LIST })
    agreedToTerms: VERIFICATION_VALUE_TYPE
  
    @Prop()
    country: string
  
    @Prop()
    state: string
  
    @Prop()
    phone: string
  
    @Prop()
    imageUrl: string
  
    @Prop({ enum: VERIFICATION_VALUE_TYPE_LIST })
    emailVerified: VERIFICATION_VALUE_TYPE
  
    @Prop({ enum: VERIFICATION_VALUE_TYPE_LIST })
    phoneVerified: VERIFICATION_VALUE_TYPE
  
    @Prop({ enum: VERIFICATION_VALUE_TYPE_LIST })
    isAdmin: VERIFICATION_VALUE_TYPE
  
    @Prop()
    lastLoginDate: Date
  
    @Prop()
    createdAt: Date
  
    @Prop()
    updatedAt: Date
  
    @Prop({ enum: USER_LOCK_LIST })
    lock: USER_LOCK;
  
    @Prop({ enum: USER_SIGNUP_STATUS_TYPE_LIST })
    authStatus: USER_SIGNUP_STATUS_TYPE
  
    @Prop({ enum: USER_TYPE_LIST })
    userType: USER_TYPE
  
    @Prop({ enum: API_VERSION_LIST })
    version: API_VERSIONS
  }
  
  export const UserSchema = SchemaFactory.createForClass(User);
  UserSchema.index(
    {
      firstName: 'text',
      lastName: 'text',
      email: 'text',
      phone: 'text',
      _id: 'text'
    },
    {
      weights: {
        firstName: 5,
        lastName: 5,
        email: 3,
        phone: 1,
        _id: 1
      }
    }
  )