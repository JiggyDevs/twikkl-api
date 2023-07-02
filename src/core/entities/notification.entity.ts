import { API_VERSIONS } from 'src/lib/constants'

export enum NotificationMethodType {
  IN_HOUSE = 'in_house',
  TO_USER = 'to_user'
}

export type INotificationUserType = {
  userId: string
  email: string
}

export class Notification {
  message?: string
  link?: string
  title?: string
  image?: string
  video?: string
  sentTo?: INotificationUserType
  author?: string
  github?: string
  processedBy?: INotificationUserType
  createdAt?: Date
  updatedAt?: Date
  version?: API_VERSIONS
  seen?: boolean
}