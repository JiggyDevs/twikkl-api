// import { Notification } from "./entities/notification.entity";

import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { IDataServices } from 'src/core/abstracts';
import {
  IClickAllNotifications,
  IClickedNotification,
  ICreateNotification,
  IGetNotifications,
} from './notification.type';
import { NotificationFactoryService } from './notification-factory.service';
import { OptionalQuery } from 'src/core/types/database';
import { Notification } from './entities/notification.entity';
import { DoesNotExistsException } from 'src/lib/exceptions';

@Injectable()
export class NotificationService {
  constructor(
    private data: IDataServices,
    private notificationFactory: NotificationFactoryService,
  ) {}

  cleanNotificationsQuery(data: IGetNotifications) {
    const key: Partial<IGetNotifications> = {};

    if (data._id) key._id = data._id;
    if (data.content) key.content = data.content;
    if (data.title) key.title = data.title;
    if (data.user) key.user = data.user;
    if (data.clicked === false || data.clicked) key.clicked = data.clicked;
    if (data.page) key.page = data.page;
    if (data.perpage) key.perpage = data.perpage;
    if (data.sort) key.sort = data.sort;

    return key;
  }

  async create(payload: ICreateNotification) {
    try {
      const { title, content, user, post, from } = payload;

      const notificationPayload: OptionalQuery<Notification> = {
        title,
        content,
        user,
        from,
        post,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const factory = this.notificationFactory.create(notificationPayload);

      const data = await this.data.notification.create(factory);

      return {
        message: 'Notification created successfully',
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

  async getNotifications(payload: IGetNotifications) {
    try {
      const filterQuery = this.cleanNotificationsQuery(payload);

      const { data, pagination } =
        await this.data.notification.findAllWithPagination(filterQuery, {
          populate: ['post', 'user'],
        });

      return {
        message: 'Notifications retrieved successfully',
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

  async clickOnNotification(payload: IClickedNotification) {
    try {
      const { notificationId } = payload;

      const notification = await this.data.notification.findOne({
        _id: notificationId,
      });
      if (!notification)
        throw new DoesNotExistsException('Notification not found');

      await this.data.notification.update(
        { _id: notification._id },
        { clicked: true },
      );

      return {
        message: 'Notification marked as read',
        data: {},
        status: HttpStatus.OK,
      };
    } catch (error) {
      Logger.error(error);
      if (error.name === 'TypeError')
        throw new HttpException(error.message, 500);
      throw error;
    }
  }

  async markAllNotificationsAsRead(payload: IClickAllNotifications) {
    try {
      const { notificationIds } = payload;

      for (let i = 0; i < notificationIds.length; i++) {
        const notification = await this.data.notification.findOne({
          _id: notificationIds[i],
        });

        await this.data.notification.update(
          { _id: notification._id },
          { clicked: true },
        );
      }

      return {
        message: 'Notifications marked as read',
        data: {},
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

// export abstract class INotificationServices {
//   abstract inHouseNotification?(notification: Notification)
// }
