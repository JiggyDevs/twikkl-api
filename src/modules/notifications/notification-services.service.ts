import { Injectable } from '@nestjs/common';
// import * as firebase from 'firebase-admin';
import * as path from 'path';
import { Notification } from "./entities/notification.entity";
// import { NotificationToken } from './entities/notification-token.entity';
// import { NotificationDto } from './dto/create-notification.dto';
// import { UpdateNotificationDto } from './dto/update-notification.dto';

export abstract class INotificationServices {
  abstract inHouseNotification?(notification: Notification)
}


// firebase.initializeApp({
//   credential: firebase.credential.cert(
//     path.join(__dirname, '..', '..', 'firebase-adminsdk.json'),
//   ),
// });

@Injectable()
export class NotificationService {
  constructor(
  ) {}

  // acceptPushNotification = async (
  //   user: any,
  //   notification_dto: NotificationDto ,
  // ): Promise<NotificationToken> => {};

  // disablePushNotification = async (
  //   user: any,
  //   update_dto: UpdateNotificationDto,
  // ): Promise<void> => {};

  getNotifications = async (): Promise<any> => {};

  sendPush = async (user: any, title: string, body: string): Promise<void> => {};
}