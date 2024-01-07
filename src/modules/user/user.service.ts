import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { IDataServices } from 'src/core/abstracts';
import { UserFactoryService } from './user-factory.service';
import {
  IGetAllUsers,
  IGetUser,
  ISetNotifications,
  IUpdateUserProfile,
} from './user.type';
import { DoesNotExistsException } from 'src/lib/exceptions';
import * as _ from 'lodash';
import { OptionalQuery } from 'src/core/types/database';
import { User } from './entities/user.entity';

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
}
