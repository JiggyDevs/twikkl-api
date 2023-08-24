import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DiscordServicesModule } from 'src/frameworks/notification-services/discord/discord-service.module';
import { FileSystemModule } from '../file-system/file-system.module';
import { DataServicesModule } from '../mongoDb/data-services.module';
import { Followers, FollowersSchema } from './schemas/followers.schema';
import { FollowingFactoryService } from './following-factory.service';
import { FollowingService } from './following.service';
import { FollowingController } from './following.controller';
import { NotificationFactoryService } from '../notifications/notification-factory.service';
import { FirebaseService } from '../firebase/firebase.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Followers.name, schema: FollowersSchema },
    ]),
    DataServicesModule,
    DiscordServicesModule,
    FileSystemModule,
  ],
  controllers: [FollowingController],
  providers: [
    FollowingFactoryService,
    FollowingService,
    NotificationFactoryService,
    FirebaseService,
  ],
  exports: [FollowingFactoryService, FollowingService],
})
export class FollowingModule {}
