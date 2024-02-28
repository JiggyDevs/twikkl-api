import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { IDataServices } from 'src/core/abstracts';
import {
  IFollowAUser,
  IGetAllFollowers,
  IUnFollowUser,
} from './following.type';
import {
  AlreadyExistsException,
  DoesNotExistsException,
} from 'src/lib/exceptions';
import { FollowingFactoryService } from './following-factory.service';
import { OptionalQuery } from 'src/core/types/database';
import { Followers } from './entities/followers.entites';
import { BadRequestsException } from 'src/lib/exceptions';
import { Notification } from '../notifications/entities/notification.entity';
import { User } from '../user/entities/user.entity';
import { NotificationFactoryService } from '../notifications/notification-factory.service';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class FollowingService {
  constructor(
    private data: IDataServices,
    private followFactory: FollowingFactoryService,
    private notificationFactory: NotificationFactoryService,
    private firebase: FirebaseService,
  ) {}

  cleanFollowersQuery(data: IGetAllFollowers) {
    const key: Partial<IGetAllFollowers> = {};

    if (data._id) key._id = data._id;
    if (data.follower) key.follower = data.follower;
    if (data.page) key.page = data.page;
    if (data.perpage) key.perpage = data.perpage;
    if (data.q) key.q = data.q;
    if (data.sort) key.sort = data.sort;
    if (data.user) key.user = data.user;

    return key;
  }

  async followAUser(payload: IFollowAUser) {
    try {
      const { userToFollow, userId } = payload;

      const user = await this.data.users.findOne({ _id: userToFollow });
      if (!user) throw new DoesNotExistsException('User to follow not found');

      if (userToFollow === userId)
        throw new BadRequestsException('Cannot follow self');

      const follower = await this.data.followers.findOne({
        follower: userId,
        user: userToFollow,
      });
      if (follower) throw new AlreadyExistsException('Already following user');

      const followPayload: OptionalQuery<Followers> = {
        follower: userId,
        user: userToFollow,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const factory = this.followFactory.create(followPayload);
      const data = await this.data.followers.create(factory);

      const userDetails = await this.data.users.findOne({ _id: userId });

      const followNotificationPayload: OptionalQuery<Notification> = {
        title: 'Follow',
        content: `You followed ${user.username}`,
        type: 'following',
        from: user._id,
        user: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const followedNotificationPayload: OptionalQuery<Notification> = {
        title: 'Follow',
        content: `${userDetails.username} started following you`,
        type: 'following',
        user: userToFollow,
        from: userDetails._id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const followNotificationFactory = this.notificationFactory.create(
        followNotificationPayload,
      );
      const followedNotificationFactory = this.notificationFactory.create(
        followedNotificationPayload,
      );

      await this.data.notification.create(followNotificationFactory);
      await this.data.notification.create(followedNotificationFactory);

      const sendNotification = await this.firebase.sendToUser(
        userDetails,
        'Follow',
        `${userDetails.username} followed you`,
      );
      console.log({ sendNotification });

      return {
        message: 'Successfully followed user',
        data,
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      Logger.error(error);
      if (error.name === 'TypeError')
        throw new HttpException(error.message, 500);
      throw error;
    }
  }

  async unFollowUser(payload: IUnFollowUser) {
    try {
      const { userToUnFollow, userId } = payload;

      const user = await this.data.users.findOne({ _id: userToUnFollow });
      if (!user) throw new DoesNotExistsException('User to unfollow not found');

      const follower = await this.data.followers.findOne({
        follower: userId,
        user: userToUnFollow,
      });
      if (!follower) throw new DoesNotExistsException('Follower not found');

      await this.data.followers.delete({ _id: follower._id });

      return {
        message: 'Successfully unfollowed user',
        status: HttpStatus.OK,
      };
    } catch (error) {
      Logger.error(error);
      if (error.name === 'TypeError')
        throw new HttpException(error.message, 500);
      throw error;
    }
  }

  async getAllFollowers(payload: IGetAllFollowers) {
    try {
      const filterQuery = this.cleanFollowersQuery(payload);

      const { data, pagination } =
        await this.data.followers.findAllWithPagination(filterQuery);

      return {
        message: 'Successfully retrieved all followers',
        data,
        pagination,
        status: HttpStatus.OK,
      };
    } catch (error) {
      Logger.error(error);
      if (error.name === 'TypeError')
        throw new HttpException(error.message, 500);
      throw error;
    }
  }

  async getAllFollowing(payload: IGetAllFollowers) {
    try {
      const filterQuery = this.cleanFollowersQuery(payload);

      const { data, pagination } =
        await this.data.followers.findAllWithPagination(filterQuery);

      return {
        message: 'Successfully retrieved all followers',
        data,
        pagination,
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
