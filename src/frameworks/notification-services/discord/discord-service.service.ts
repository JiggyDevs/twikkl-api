import { Injectable, Logger } from "@nestjs/common";
import { INotificationServices } from "src/core/abstracts";
import { Notification } from "src/core/entities/notification.entity";
import { Webhook, MessageBuilder } from 'discord-webhook-node'
import { PLATFORM_NAME, GITHUB_LINK } from "src/lib/constants";


@Injectable()
export class DiscordService implements INotificationServices {
  async inHouseNotification(notification: Notification) {
    // send to discord
    try {
      const hook = new Webhook(notification?.link);
      const embed = await new MessageBuilder()
        .setTitle(notification?.title)
        .setAuthor(
          notification?.author || PLATFORM_NAME,
          '',
          notification?.github || GITHUB_LINK
        )
        .setDescription(notification?.message)
      hook.send(embed);
      Logger.log('Discord notification sent')

    } catch (e) {
      Logger.error('@discord', e)
    }

  }
}