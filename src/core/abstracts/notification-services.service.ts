import { Notification } from 'src/modules/notifications/entities/notification.entity';

export abstract class INotificationServices {
  abstract inHouseNotification?(notification: Notification);
}
