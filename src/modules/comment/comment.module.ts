import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { CommentsFactoryService } from './comments-factory-service.service';
import { DataServicesModule } from '../mongoDb/data-services.module';
import { DiscordServicesModule } from 'src/frameworks/notification-services/discord/discord-service.module';
import { NotificationFactoryService } from '../notifications/notification-factory.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    DataServicesModule,
    DiscordServicesModule
  ],
  controllers: [CommentController],
  providers: [CommentService, CommentsFactoryService, NotificationFactoryService],
  exports: [CommentsFactoryService, CommentService]
})

export class CommentModule {}
