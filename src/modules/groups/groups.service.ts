import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Group } from './schemas/groups.schema';
import { User } from '../users/schemas/users.schema';

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel('Group') private readonly groupModel: Model<Group>,
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {}

  create(createGroupDto: CreateGroupDto) {
    return 'This action adds a new group';
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

  update(id: number, updateGroupDto: UpdateGroupDto) {
    return `This action updates a #${id} group`;
  }

  remove(id: number) {
    return `This action removes a #${id} group`;
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
