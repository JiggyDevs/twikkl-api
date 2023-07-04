import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { UserFactoryService } from '../user/user-factory.service';
import { DataServicesModule } from '../mongoDb/data-services.module';
import { DiscordServicesModule } from 'src/frameworks/notification-services/discord/discord-service.module';
import { JwtService } from '@nestjs/jwt';
import { IInMemoryServices } from 'src/core/abstracts/in-memory.abstract';
// import { JwtModule } from '@nestjs/jwt';
// import { jwtConstants } from './auth.constant';
// import { UserInterceptor } from '../user/interceptor/user.interceptor';

@Module({
  imports: [
    DataServicesModule,
    DiscordServicesModule,
    UserModule,
    // JwtModule.register({
    //   global: true,
    //   secret: jwtConstants.secret,
    //   signOptions: { expiresIn: '10m' },
    // }),
  ],
  providers: [AuthService, UserFactoryService, JwtService],
  controllers: [AuthController],
})
export class AuthModule {}
