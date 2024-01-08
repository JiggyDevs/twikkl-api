import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Group, GroupSchema } from './schemas/group.schema';

import { DataServicesModule } from '../mongoDb/data-services.module';
import { GroupFactoryService } from './group-factory.service';
import { FavoriteGroupsFactoryService } from './favorite-group-factory.service';
import { FavoriteGroupsService } from './favorite-group.service';
import { FavoriteGroupsController } from './favorite-group.controller';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Group.name, schema: GroupSchema }]),
    DataServicesModule,
    CategoryModule,
  ],
  controllers: [GroupController, FavoriteGroupsController],
  providers: [
    GroupService,
    GroupFactoryService,
    FavoriteGroupsFactoryService,
    FavoriteGroupsService,
  ],
})
export class GroupsModule {}
