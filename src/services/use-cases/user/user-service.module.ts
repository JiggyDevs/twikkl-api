import { Module } from "@nestjs/common";
import { DiscordServicesModule } from "src/frameworks/notification-services/discord/discord-service.module";
import { DataServicesModule } from "src/services/data-services/data-services.module";
import { AuthServices } from "./auth-services.service";
import { UserFactoryService } from "./user-factory.service";
import { UserService } from "./user.service";

@Module({
  imports: [
    DataServicesModule,
    DiscordServicesModule,
  ],
  providers: [UserFactoryService, AuthServices, UserService],
  exports: [UserFactoryService, AuthServices, UserService],
})

export class UserServicesModule { }