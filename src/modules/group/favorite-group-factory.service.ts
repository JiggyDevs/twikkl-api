import { Injectable } from '@nestjs/common';
import { OptionalQuery } from 'src/core/types/database';
import { FavoriteGroups } from './entities/favorite-group.entity';

@Injectable()
export class FavoriteGroupsFactoryService {
  create(data: OptionalQuery<FavoriteGroups>) {
    const favoriteGroup = new FavoriteGroups();

    if (data.group) favoriteGroup.group = data.group;
    if (data.user) favoriteGroup.user = data.user;
    if (data.createdAt) favoriteGroup.createdAt = data.createdAt;
    if (data.updatedAt) favoriteGroup.updatedAt = data.updatedAt;

    return favoriteGroup;
  }
}
