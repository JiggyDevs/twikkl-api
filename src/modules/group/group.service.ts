import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { InjectModel } from '@nestjs/mongoose';
import { JoinGroupDto } from './dto/join-group.dto';
import { LeaveGroupDto } from './dto/leave-group.dto';
import { IDataServices } from 'src/core/abstracts';
import { GroupFactoryService } from './group-factory.service';
import { OptionalQuery } from 'src/core/types/database';
import { Group } from './entities/group.entity';
import { User } from '../user/entities/user.entity';
import {
  DoesNotExistsException,
  ForbiddenRequestException,
} from 'src/lib/exceptions';
import {
  IGetGroup,
  IGetGroupPosts,
  IGetGroups,
  IGetUserGroup,
  IGroupAction,
} from './group.type';
import { Types } from 'mongoose';

@Injectable()
export class GroupService {
  constructor(
    private groupFactory: GroupFactoryService,
    private data: IDataServices,
  ) {}
  async create(payload: CreateGroupDto) {
    try {
      const { creator, description, name, avatar, coverImg, isPrivate } =
        payload;
      const groupPayload: OptionalQuery<Group> = {
        creator: creator,
        description,
        name,
        avatar,
        coverImg,
        members: [creator],
        isPrivate,
      };

      const factory = this.groupFactory.create(groupPayload);
      const data = await this.data.group.create(factory);

      return {
        message: 'Group created successfully',
        data,
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      Logger.error(error);
      if (error.name === 'TypeError')
        throw new HttpException(error.message, 500);
      throw error;
    }
  }

  async find(payload: IGetGroups) {
    try {
      const { excludeJoined, userId, ...otherQueryParams } = payload;
      let findQuery = undefined;
      console.log({ userId });

      if (excludeJoined) {
        findQuery = {
          ...otherQueryParams,
          members: { $nin: userId }, // Use $nin to exclude groups where the user is a member
        };
      } else {
        findQuery = { ...otherQueryParams };
      }

      if (findQuery.q) {
        const { data, pagination } = await this.data.group.search(findQuery);

        return {
          message: 'User Posts retrieved successfully',
          data,
          pagination,
          status: HttpStatus.OK,
        };
      }

      let { data, pagination } = await this.data.group.findAllWithPagination(
        findQuery,
      );

      return {
        message: 'Groups retrieved successfully',
        data,
        pagination,
        status: HttpStatus.OK,
      };
    } catch (error) {
      Logger.error(error);
      if (error.name === 'TypeError')
        throw new HttpException(error.message, 500);
      throw error;
    }
  }

  async getGroupPosts(payload: IGetGroupPosts) {
    try {
      const query = {
        ...payload,
        group: payload.groupId,
      };
      let { data, pagination } = await this.data.post.findAllWithPagination(
        query,
      );

      return {
        message: 'Posts retrieved successfully',
        data,
        pagination,
        status: HttpStatus.OK,
      };
    } catch (error) {
      Logger.error(error);
      if (error.name === 'TypeError')
        throw new HttpException(error.message, 500);
      throw error;
    }
  }

  async findOne(payload: IGetGroup) {
    try {
      const { groupId } = payload;

      const group = await this.data.group.findOne({
        _id: groupId,
        isDeleted: false,
      });

      if (!group) throw new DoesNotExistsException('Group not found');

      return {
        message: 'Group retrieved successfully',
        data: group,
        status: HttpStatus.OK,
      };
    } catch (error) {
      Logger.error(error);
      if (error.name === 'TypeError')
        throw new HttpException(error.message, 500);
      throw error;
    }
  }

  async updateGroup(
    _id: string,
    updateGroupDto: UpdateGroupDto,
  ): Promise<Group> {
    return this.data.group.update({ _id }, updateGroupDto).exec();
  }

  // async remove(_id: string): Promise<Group> {
  //   return this.data.group.update({_id}, { isDeleted: true })
  //     .exec();
  // }

  async deleteGroup(payload: IGroupAction) {
    try {
      const { groupId, userId } = payload;

      const group = await this.data.group.findOne({ _id: groupId });
      if (!group) throw new DoesNotExistsException('Group not found');

      if (group.creator !== userId)
        throw new ForbiddenRequestException(
          'Not permitted to perform this action',
        );

      await this.data.group.update(
        { _id: group._id },
        { $set: { isDeleted: true } },
      );

      return {
        message: 'Post deleted',
        status: HttpStatus.OK,
      };
    } catch (error) {
      Logger.error(error);
      if (error.name === 'TypeError')
        throw new HttpException(error.message, 500);
      throw error;
    }
  }

  async joinGroup(payload: IGroupAction) {
    try {
      // const group = await this.groupModel.findById(groupId);
      // const user = await this.userModel.findById(userId);
      const { groupId, userId } = payload;
      const data = this.data.group.update(
        { _id: groupId },
        { $addToSet: { members: userId } },
        // { new: true },
      );

      if (!data) {
        // Handle error if group not found
        throw new DoesNotExistsException('Group not found.');
      }

      return {
        message: 'Group joined',
        data,
        status: HttpStatus.OK,
      };
    } catch (error) {
      Logger.error(error);
      if (error.name === 'TypeError')
        throw new HttpException(error.message, 500);
      throw error;
    }
  }

  async leaveGroup(payload: IGroupAction) {
    try {
      // const group = await this.groupModel.findById(groupId);
      // const user = await this.userModel.findById(userId);
      const { groupId, userId } = payload;
      const data = this.data.group.update(
        { _id: groupId },
        { $pull: { members: userId } },
        // { new: true },
      );

      if (!data) {
        // Handle error if group not found
        throw new DoesNotExistsException('Group not found.');
      }

      return {
        message: 'Group left',
        data,
        status: HttpStatus.OK,
      };
    } catch (error) {
      Logger.error(error);
      if (error.name === 'TypeError')
        throw new HttpException(error.message, 500);
      throw error;
    }
  }

  async getUserGroups(payload: IGetUserGroup) {
    try {
      const { userId } = payload;

      let { data: groups, pagination } =
        await this.data.group.findAllWithPagination({
          members: userId,
        });
      if (!groups) throw new DoesNotExistsException('No Groups found');

      return {
        message: 'User Groups retrieved successfully',
        data: groups,
        pagination,
        status: HttpStatus.OK,
      };
    } catch (error) {
      Logger.error(error);
      if (error.name === 'TypeError')
        throw new HttpException(error.message, 500);
      throw error;
    }
  }

  async getGroupMembers(payload: IGetGroup) {
    try {
      const { groupId } = payload;

      const group = await this.data.group.find({
        _id: groupId,
      });

      if (!group) throw new DoesNotExistsException('Group not found');

      return {
        message: 'Group members retrieved successfully',
        data: group.members,
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
