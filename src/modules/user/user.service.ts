import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { IDataServices } from 'src/core/abstracts';
import { UserFactoryService } from './user-factory.service';
import {
  ICreateTransactionPin,
  IGetAllUsers,
  IGetUser,
  ISetNotifications,
  IUpdateTransactionPin,
  IUpdateUserProfile,
} from './user.type';
import {
  AlreadyExistsException,
  BadRequestsException,
  DoesNotExistsException,
} from 'src/lib/exceptions';
import * as _ from 'lodash';
import { OptionalQuery } from 'src/core/types/database';
import { User } from './entities/user.entity';
import { compareHash, hash } from 'src/lib/utils';

@Injectable()
export class UserService {
  constructor(
    private data: IDataServices,
    private userFactory: UserFactoryService,
  ) {}

  cleanUserQuery(data: IGetAllUsers) {
    let key = {};

    if (data._id) key['_id'] = data._id;
    if (data.email) key['email'] = data.email;
    if (data.following) key['following'] = data.following;
    if (data.groups) key['groups'] = data.groups;
    if (data.page) key['page'] = data.page;
    if (data.perpage) key['perpage'] = data.perpage;
    if (data.sort) key['sort'] = data.sort;
    if (data.username) key['username'] = data.username;
    if (data.avatar) key['avatar'] = data.avatar;
    if (data.bio) key['bio'] = data.bio;
    if (data.twitter) key['twitter'] = data.twitter;

    return key;
  }

  async getAllUsers(payload: IGetAllUsers) {
    try {
      const filterQuery: any = this.cleanUserQuery(payload);

      if (filterQuery.q) {
        const { data, pagination } = await this.data.users.search(filterQuery);

        return {
          message: 'Users retrieved successfully',
          data,
          pagination,
          status: HttpStatus.OK,
        };
      }

      const { data, pagination } = await this.data.users.findAllWithPagination(
        filterQuery,
      );
      return {
        message: 'Users retrieved successfully',
        status: HttpStatus.OK,
        data,
        pagination,
      };
    } catch (error) {
      Logger.error(error);
      if (error.name === 'TypeError')
        throw new HttpException(error.message, 500);
      throw error;
    }
  }

  async getUser(payload: IGetUser) {
    try {
      const { userId } = payload;
      const user = await this.data.users.findOne({ _id: userId });
      if (!user) throw new DoesNotExistsException('User not found!');

      return {
        message: 'User retrieved successfully',
        status: HttpStatus.OK,
        data: user,
      };
    } catch (error) {
      Logger.error(error);
      if (error.name === 'TypeError')
        throw new HttpException(error.message, 500);
      throw error;
    }
  }

  async updateUserProfile(payload: IUpdateUserProfile) {
    try {
      const { userId } = payload;

      const user = await this.data.users.findOne({ _id: userId });
      if (!user) throw new DoesNotExistsException('User does not exist!');

      delete payload.userId;
      const data = await this.data.users.update(
        { _id: user._id },
        { $set: { ...payload } },
      );

      return {
        message: 'User profile updated successfully',
        status: HttpStatus.OK,
        data,
      };
    } catch (error) {
      Logger.error(error);
      if (error.name === 'TypeError')
        throw new HttpException(error.message, 500);
      throw error;
    }
  }

  async setNotifications(payload: ISetNotifications) {
    try {
      const {
        userId,
        likesNotification,
        commentsNotification,
        followersNotification,
        mentionsNotification,
        repostNotification,
      } = payload;

      const user = await this.data.users.findOne({ _id: userId });
      if (!user) throw new DoesNotExistsException('User not found.');

      const userUpdatePayload: OptionalQuery<User> = {
        likesNotification,
        commentsNotification,
        followersNotification,
        mentionsNotification,
        repostNotification,
      };
      await this.data.users.update(
        { _id: user._id },
        { $set: { ...userUpdatePayload } },
      );

      return {
        message: 'Notifications set successfully',
        status: HttpStatus.OK,
      };
    } catch (error) {
      Logger.error(error);
      if (error.name === 'TypeError')
        throw new HttpException(error.message, 500);
      throw error;
    }
  }

  async createTransactionPin(payload: ICreateTransactionPin) {
    try {
      const { userId, pin } = payload;

      const userExists: User = await this.data.users.findOne({ _id: userId });
      if (!userExists) throw new DoesNotExistsException('User does not exist');

      if (userExists.transactionPin) {
        throw new AlreadyExistsException('User already has a transaction pin');
      }

      const hashedPin = await hash(pin);

      await this.data.users.update(
        { _id: userId },
        { $set: { transactionPin: hashedPin } },
      );

      return {
        message: 'Transaction PIN created successfully',
        status: HttpStatus.OK,
      };
    } catch (error) {
      Logger.error(error);
      if (error.name === 'TypeError')
        throw new HttpException(error.message, 500);
      throw error;
    }
  }

  async updateTransactionPin(payload: IUpdateTransactionPin) {
    try {
      const { oldPin, pin, userId } = payload;

      const userExists = await this.data.users.findOne({ _id: userId });
      if (!userExists) throw new DoesNotExistsException('User does not exist');

      const correctPin: boolean = await compareHash(
        oldPin,
        userExists.transactionPin,
      );
      if (!correctPin) throw new BadRequestsException('Invalid pin');

      await this.data.users.update(
        { _id: userId },
        { transactionPin: await hash(pin) },
      );
      return {
        status: HttpStatus.OK,
        message: 'User transaction pin changed successfully',
        data: {},
      };
    } catch (error) {
      Logger.error(error);
      if (error.name === 'TypeError')
        throw new HttpException(error.message, 500);
      throw error;
    }
  }
}
