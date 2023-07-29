import { Module } from "@nestjs/common";
import { Notification, NotificationSchema } from "./schemas/notification.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { DiscordServicesModule } from "src/frameworks/notification-services/discord/discord-service.module";
import { DataServicesModule } from "../mongoDb/data-services.module";
import { NotificationFactoryService } from "./notification-factory.service";
import { NotificationService } from "./notification-services.service";
import { NotificationController } from "./notification.controller";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]),
        DataServicesModule,
        DiscordServicesModule,
    ],
    controllers: [NotificationController],
    providers: [NotificationFactoryService, NotificationService],
    exports: [NotificationFactoryService, NotificationService]
})

export class NotificationServiceModule {}