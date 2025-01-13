import { PaginationType } from 'src/core/types/database';
import { SetNotificationsDto, UpdateUserDto } from './dto/update-user.dto';
import {
  CreateTransactionPinDto,
  UpdateTransactionPinDto,
} from './dto/create-pin.dto';

export type IGetAllUsers = PaginationType & {
  _id: number;
  username: string;
  email: string;
  password: string;
  following: string[];
  groups: string[];
  avatar: string;
  bio: string;
  twitter: string;
};

export type FindByUserId = {
  userId: string;
};

export type IGetUser = {
  userId: string;
};

export type IUpdateUserProfile = UpdateUserDto & {
  userId: string;
};

export type ISetNotifications = SetNotificationsDto & {
  userId: string;
};

export type ICreateTransactionPin = CreateTransactionPinDto & {
  userId: string;
};

export type IUpdateTransactionPin = UpdateTransactionPinDto & {
  userId: string;
};
