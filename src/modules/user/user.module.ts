import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserInterceptor } from './interceptor/user.interceptor';
import { UserFactoryService } from './user-factory.service';
import { DataServicesModule } from '../mongoDb/data-services.module';
import { DiscordServicesModule } from 'src/frameworks/notification-services/discord/discord-service.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    DataServicesModule,
    DiscordServicesModule
  ],
  controllers: [UserController],
  providers: [UserService, UserFactoryService, JwtService],
  exports: [UserService, UserFactoryService],
})
export class UserModule {}
