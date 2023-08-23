import { Module } from '@nestjs/common';
import { DiscordServicesModule } from 'src/frameworks/notification-services/discord/discord-service.module';
import { DataServicesModule } from '../mongoDb/data-services.module';
import { FirebaseService } from './firebase.service';

@Module({
  imports: [DataServicesModule, DiscordServicesModule],
  controllers: [],
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseServiceModule {}
