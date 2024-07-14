import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AxiosServiceModule } from 'src/frameworks/axios/axios-service.module';
import { DiscordServicesModule } from 'src/frameworks/notification-services/discord/discord-service.module';
import { DataServicesModule } from 'src/modules/mongoDb/data-services.module';
import { PlunkEventListener } from './listeners/plunk-email.listener';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: false,
      delimiter: '.',
      newListener: false,
      removeListener: false,
      maxListeners: 10,
      verboseMemoryLeak: false,
      ignoreErrors: false,
    }),
    DataServicesModule,
    AxiosServiceModule,
    DiscordServicesModule,
  ],
  providers: [PlunkEventListener],
})
export class EventEmitterServiceModule {}
