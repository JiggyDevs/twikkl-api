import { Module } from '@nestjs/common';
import { DataServicesModule } from '../mongoDb/data-services.module';
import { DiscordServicesModule } from 'src/frameworks/notification-services/discord/discord-service.module';
import { AdminAuthFactoryService } from './admin-auth-factory.service';
import { AdminAuthService } from './admin-auth.service';
import controllers from './controllers';
import { DiscordService } from 'src/frameworks/notification-services/discord/discord-service.service';

@Module({
  imports: [DataServicesModule, DiscordServicesModule],
  controllers: [...controllers],
  providers: [AdminAuthFactoryService, AdminAuthService, DiscordService],
  exports: [AdminAuthFactoryService, AdminAuthService],
})
export class AdminServiceModule {}
