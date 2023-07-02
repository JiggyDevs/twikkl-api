import { Notification } from "./entities/notification.entity";

export abstract class INotificationServices {
  abstract inHouseNotification?(notification: Notification)
}