import { Injectable, Logger } from '@nestjs/common';
import { INotificationServices } from 'src/core/abstracts/notification-services.service';
import { Notification } from 'src/modules/notifications/entities/notification.entity';
import { Webhook, MessageBuilder } from 'discord-webhook-node';
import { PLATFORM_NAME, GITHUB_LINK } from 'src/lib/constants';
import { OptionalQuery } from 'src/core/types/database';

@Injectable()
export class DiscordService implements INotificationServices {
  async inHouseNotification(notification: OptionalQuery<Notification>) {
    // send to discord
    try {
      const hook = new Webhook(notification?.link);
      const embed = await new MessageBuilder()
        .setTitle(notification?.title)
        .setAuthor(
          notification?.user || PLATFORM_NAME,
          '',
          notification?.user || GITHUB_LINK,
        )
        .setDescription(notification?.content);
      hook.send(embed);
      Logger.log('Discord notification sent');
    } catch (e) {
      Logger.error('@discord', e);
    }
  }
}
