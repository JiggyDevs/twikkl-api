import { MiddlewareConsumer, Module } from '@nestjs/common';
import { DataServicesModule } from './modules/mongoDb/data-services.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { GroupsModule } from './modules/group/group.module';
import { PostsModule } from './modules/post/post.module';
import { UserModule } from './modules/user/user.module';
import { CategoryModule } from './modules/category/category.module';
import { CommentModule } from './modules/comment/comment.module';
import { RedisServiceModule } from './frameworks/in-memory-database/redis/redis-service.module';
import { JWT_USER_PAYLOAD_TYPE } from './lib/constants';


declare global {
  namespace Express {
    export interface Request {
      user?: JWT_USER_PAYLOAD_TYPE;
    }
  }
  var io: any;
}
@Module({
  imports: [
    DataServicesModule,
    AuthModule,
    UserModule,
    RedisServiceModule,
    PostsModule,
    // GroupsModule,
    // CategoryModule,
    // CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {
  configure(consumer: MiddlewareConsumer){
    consumer
    .apply()
    .forRoutes('*')
  }
}
