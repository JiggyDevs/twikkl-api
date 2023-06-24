import { MiddlewareConsumer, Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { AuthModule } from './modules/auth/auth.module';
// import { GroupsModule } from './modules/group/group.module';
// import { PostsModule } from './modules/post/post.module';
// import { UserModule } from './modules/user/user.module';
// import { CategoryModule } from './modules/category/category.module';
// import { CommentModule } from './modules/comment/comment.module';
import services from './services';
import controllers from './controllers';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

// @Module({
//   imports: [
//     MongooseModule.forRoot('mongodb://127.0.0.1/twikkl'),
//     AuthModule,
//     UserModule,
//     PostsModule,
//     GroupsModule,
//     CategoryModule,
//     CommentModule,
//   ],
//   controllers: [AppController],
//   providers: [AppService],
// })

@Module({
  imports: [
    ...services,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'docs'),
      exclude: ['/api*'],
    })
  ],
  controllers: [...controllers],
  providers: [AppService]
})

export class AppModule {
  configure(consumer: MiddlewareConsumer){
    consumer
    .apply()
    .forRoutes('*')
  }
}
