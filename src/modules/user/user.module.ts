import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserInterceptor } from './interceptor/user.interceptor';
import { UserFactoryService } from './user-factory.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, UserFactoryService],
  exports: [UserService, UserFactoryService],
})
export class UserModule {}
