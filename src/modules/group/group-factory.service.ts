import { Injectable } from '@nestjs/common';
import { OptionalQuery } from 'src/core/types/database';
import { Group } from './entities/group.entity';

@Injectable()
export class GroupFactoryService {
  create(data: OptionalQuery<Group>) {
    const group = new Group();
    if (data.avatar) group.avatar = data.avatar;
    if (data.coverImg) group.coverImg = data.coverImg;
    if (data.creator) group.creator = data.creator;
    if (data.description) group.description = data.description;
    // if (data.isAdminDeleted) group.isAdminDeleted = data.isAdminDeleted;
    // if (data.isDeleted) group.isDeleted = data.isDeleted;
    if (data.members) group.members = data.members;
    if (data.name) group.name = data.name;

    return group;
  }
}