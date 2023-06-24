import { Notification } from 'src/core/entities/notification.entity'

export abstract class INotificationServices {
  abstract inHouseNotification?(notification: Notification)
}