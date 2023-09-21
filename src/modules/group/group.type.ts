import { DateType, PaginationType } from 'src/core/types/database';
import { AddGroupToFavoritesDto, CreateGroupDto } from './dto/create-group.dto';

export type IGetGroups = PaginationType & {};

export type IGetGroup = {
  groupId: string;
};

export type IGetGroupPosts = PaginationType & IGetGroup & {};

export type IGetUserGroup = {
  userId: string;
};

export type IGroupAction = {
  groupId: string;
  userId: string;
};

export type ICreateGroup = CreateGroupDto & {
  creator: string;
};

export type IAddGroupToFavorites = AddGroupToFavoritesDto & {
  userId: string;
};

export type IGetAllUserFavoriteGroups = PaginationType &
  DateType & {
    _id: string;
    group: string;
  };

export type IGetFavoriteGroup = {
  groupId: string;
};

export type IRemoveGroupFromFavorites = {
  groupId: string;
};
