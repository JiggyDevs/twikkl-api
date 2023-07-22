import { PaginationType } from "src/core/types/database"
import { MarkAllNotificationsDto } from "./dto/mark-all-notifications.dto"

export type ICreateNotification = {
    title: string
    content: string
    user: string
}

export type IGetNotifications = PaginationType & {
    _id: string
    title: string
    content: string
    clicked: boolean
    user: string
}

export type IClickedNotification = {
    notificationId: string
}

export type FindByNotificationId = {
    notificationId: string
}

export type IClickAllNotifications = MarkAllNotificationsDto & {}