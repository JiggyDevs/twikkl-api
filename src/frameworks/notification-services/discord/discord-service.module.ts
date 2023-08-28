import { Module } from '@nestjs/common';
import { INotificationServices } from 'src/core/abstracts/notification-services.service';
import { DiscordService } from './discord-service.service';

@Module({
  providers: [
    {
      provide: INotificationServices,
      useClass: DiscordService,
    },
  ],
  exports: [INotificationServices],
})
export class DiscordServicesModule {}
