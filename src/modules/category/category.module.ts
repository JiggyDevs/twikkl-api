import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { Category, CategorySchema } from './schemas/category.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { DiscordServicesModule } from 'src/frameworks/notification-services/discord/discord-service.module';
import { DataServicesModule } from '../mongoDb/data-services.module';
import { CategoryFactoryService } from './category-factory.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
    DataServicesModule,
    DiscordServicesModule,
  ],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryFactoryService],
  exports: [CategoryFactoryService],
})
export class CategoryModule {}
