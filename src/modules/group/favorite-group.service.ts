import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { IDataServices } from 'src/core/abstracts';
import {
  IAddGroupToFavorites,
  IGetAllUserFavoriteGroups,
  IRemoveGroupFromFavorites,
} from './group.type';
import { DoesNotExistsException } from 'src/lib/exceptions';
import { FavoriteGroupsFactoryService } from './favorite-group-factory.service';
import { OptionalQuery } from 'src/core/types/database';
import { FavoriteGroups } from './entities/favorite-group.entity';

@Injectable()
export class FavoriteGroupsService {
  constructor(
    private data: IDataServices,
    private favoriteGroupFactory: FavoriteGroupsFactoryService,
  ) {}

  cleanFavoriteGroupQuery(data: IGetAllUserFavoriteGroups) {
    let key = {};

    if (data._id) key['_id'] = data._id;
    if (data.group) key['group'] = data.group;
    if (data.page) key['page'] = data.page;
    if (data.perpage) key['perpage'] = data.perpage;
    if (data.sort) key['sort'] = data.sort;

    return key;
  }

  async addGroupToFavorites(payload: IAddGroupToFavorites) {
    try {
      const { groupId, userId } = payload;

      const [group, markedGroup] = await Promise.all([
        this.data.group.findOne({
          _id: groupId,
        }),
        this.data.favoriteGroups.findOne({
          group: groupId,
          user: userId,
        }),
      ]);
      if (!group) throw new DoesNotExistsException('Group does not exist');
      if (markedGroup)
        throw new DoesNotExistsException('Group has been marked');

      const favoriteGroupPayload: FavoriteGroups = {
        group: groupId,
        user: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const factory = this.favoriteGroupFactory.create(favoriteGroupPayload);
      const data = await this.data.favoriteGroups.create(factory);
      return {
        message: 'Group added to favorites',
        status: HttpStatus.OK,
        data,
      };
    } catch (error) {
      Logger.error(error);
      if (error.name === 'TypeError')
        throw new HttpException(error.message, 500);
      throw error;
    }
  }

  async getAllUserFavoriteGroups(payload: IGetAllUserFavoriteGroups) {
    try {
      const filterQuery = this.cleanFavoriteGroupQuery(payload);

      const { data, pagination } =
        await this.data.favoriteGroups.findAllWithPagination(filterQuery);

      return {
        message: 'Favorite groups retrieved successfully',
        status: HttpStatus.OK,
        data,
        pagination,
      };
    } catch (error) {
      Logger.error(error);
      if (error.name === 'TypeError')
        throw new HttpException(error.message, 500);
      throw error;
    }
  }

  async removeGroupFromFavorites(payload: IRemoveGroupFromFavorites) {
    try {
      const { groupId, userId } = payload;

      const group = await this.data.favoriteGroups.findOne({
        group: groupId,
        user: userId,
      });
      if (!group)
        throw new DoesNotExistsException('Group not found in favorite groups');

      await this.data.favoriteGroups.delete({ group: groupId, user: userId });

      return {
        message: 'Group removed from favorites',
        status: HttpStatus.OK,
      };
    } catch (error) {
      Logger.error(error);
      if (error.name === 'TypeError')
        throw new HttpException(error.message, 500);
      throw error;
    }
  }
}
