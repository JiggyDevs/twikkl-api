import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Group } from './schemas/group.schema';
import { User } from '../user/schemas/user.schema';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel('Group') private readonly groupModel: Model<Group>,
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {}

  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    const createdGroup = new this.groupModel(createGroupDto);
    return createdGroup.save();
  }

  async find(ids?: string | string[]): Promise<Group[]> {
    let query = this.groupModel.find();

    if (Array.isArray(ids)) {
      query = query.where('_id').in(ids);
    } else {
      query = query.where('_id').equals(ids);
    }

    return query.exec();
  }

  async update(id: string, updateGroupDto: UpdateGroupDto): Promise<Group> {
    return this.groupModel.findByIdAndUpdate(id, updateGroupDto, { new: true }).exec();
  }

  async remove(id: string): Promise<Group> {
    return this.groupModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true }).exec();
  }

  async joinGroup(groupId: string, userId: string): Promise<Group> {
    const group = await this.groupModel.findById(groupId);
    const user = await this.userModel.findById(userId);

    if (!group || !user) {
      // Handle error if group or user not found
      throw new Error('Group or User not found.');
    }

    group.members.push(userId);
    user.groups.push(groupId);
    return group.save();
  }

  async leaveGroup(groupId: string, userId: string): Promise<void> {
    const group = await this.groupModel.findByIdAndUpdate(groupId, {
      $pull: { members: userId },
    });

    if (!group) {
      // Handle error if group not found
      throw new Error('Group not found.');
    }

    // Optional: You can perform additional validation or checks here

    return;
  }
}
