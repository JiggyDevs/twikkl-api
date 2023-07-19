import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './schemas/post.schema';
import { User, UserSchema } from '../user/schemas/user.schema';
import { PostFactoryService } from './post-factory-service.service';
import { DataServicesModule } from '../mongoDb/data-services.module';
import { DiscordServicesModule } from 'src/frameworks/notification-services/discord/discord-service.module';
import { LikesFactoryService } from './likes-factory-service.service';
import { FileSystemModule } from '../file-system/file-system.module';
import { BookmarkedPostFactoryService } from './bookmarked-post-factory.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    DataServicesModule,
    DiscordServicesModule,
    FileSystemModule
  ],
  controllers: [PostController],
  providers: [PostService, PostFactoryService, LikesFactoryService, BookmarkedPostFactoryService],
  exports: [PostService, PostFactoryService, LikesFactoryService, BookmarkedPostFactoryService]
})

export class PostsModule {}
