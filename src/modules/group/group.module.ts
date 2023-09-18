import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Group, GroupSchema } from './schemas/group.schema';

import { DataServicesModule } from '../mongoDb/data-services.module';
import { GroupFactoryService } from './group-factory.service';
import { FavoriteGroupsFactoryService } from './favorite-group-factory.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Group.name, schema: GroupSchema }]),
    DataServicesModule,
  ],
  controllers: [GroupController],
  providers: [GroupService, GroupFactoryService, FavoriteGroupsFactoryService],
})
export class GroupsModule {}
