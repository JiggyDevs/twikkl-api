import { Injectable } from "@nestjs/common";
import { OptionalQuery } from "src/core/types/database";
import { Notification } from "./entities/notification.entity";

@Injectable()
export class NotificationFactoryService {
    create(data: OptionalQuery<Notification>) {
        const notification = new Notification()

        if (data.clicked === false || data.clicked) notification.clicked = data.clicked
        if (data.content) notification.content = data.content
        if (data.title) notification.title = data.title
        if (data.user) notification.user = data.user
        if (data.createdAt) notification.createdAt = data.createdAt
        if (data.updatedAt) notification.updatedAt = data.updatedAt


        return notification
    }
}