import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './schemas/post.schema';
import { PostFactoryService } from './post-factory-service.service';
import { DataServicesModule } from '../mongoDb/data-services.module';
import { DiscordServicesModule } from 'src/frameworks/notification-services/discord/discord-service.module';
import { LikesFactoryService } from './likes-factory-service.service';
import { FileSystemModule } from '../file-system/file-system.module';
import { NotificationFactoryService } from '../notifications/notification-factory.service';
import { FirebaseService } from '../firebase/firebase.service';
import { TagsFactoryService } from './tags-factory.service';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    DataServicesModule,
    DiscordServicesModule,
    FileSystemModule,
  ],
  controllers: [PostController, TagsController],
  providers: [
    PostService,
    PostFactoryService,
    LikesFactoryService,
    NotificationFactoryService,
    FirebaseService,
    TagsFactoryService,
    TagsService,
  ],
  exports: [
    PostService,
    PostFactoryService,
    LikesFactoryService,
    TagsFactoryService,
    TagsService,
  ],
})
export class PostsModule {}
