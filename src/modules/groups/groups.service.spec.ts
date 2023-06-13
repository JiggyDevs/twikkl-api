import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { GroupsService } from './groups.service';
import { Model } from 'mongoose';
import { Group } from './schemas/groups.schema';
import { User } from '../users/schemas/users.schema';

describe('GroupsService', () => {
  let service: GroupsService;
  let groupModel: Model<Group>;
  let userModel: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupsService,
        {
          provide: getModelToken('Group'),
          useValue: {
            find: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getModelToken('User'),
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GroupsService>(GroupsService);
    groupModel = module.get<Model<Group>>(getModelToken('Group'));
    userModel = module.get<Model<User>>(getModelToken('User'));
  });

  describe('joinGroup', () => {
    it('should join the user to the group', async () => {
      const groupId = 'groupId';
      const userId = 'userId';

      const group = new Group();
      group.members = [];

      const user = new User();
      user.groups = [];

      jest.spyOn(groupModel, 'findById').mockResolvedValueOnce(group);
      jest.spyOn(userModel, 'findById').mockResolvedValueOnce(user);
      jest
        .spyOn(group.constructor.prototype, 'save')
        .mockResolvedValueOnce(group);

      await service.joinGroup(groupId, userId);

      expect(groupModel.findById).toHaveBeenCalledWith(groupId);
      expect(userModel.findById).toHaveBeenCalledWith(userId);
      expect(group.members).toEqual([userId]);
      expect(user.groups).toEqual([groupId]);
      expect(group.constructor.prototype.save).toHaveBeenCalled();
    });

    it('should throw an error if group or user is not found', async () => {
      const groupId = 'groupId';
      const userId = 'userId';

      jest.spyOn(groupModel, 'findById').mockResolvedValueOnce(null);
      jest.spyOn(userModel, 'findById').mockResolvedValueOnce(null);

      await expect(service.joinGroup(groupId, userId)).rejects.toThrowError(
        'Group or User not found.',
      );

      expect(groupModel.findById).toHaveBeenCalledWith(groupId);
      expect(userModel.findById).toHaveBeenCalledWith(userId);
    });
  });

  describe('leaveGroup', () => {
    it('should remove the user from the group', async () => {
      const groupId = 'groupId';
      const userId = 'userId';

      const group = new Group();
      group.members = [userId];

      jest.spyOn(groupModel, 'findByIdAndUpdate').mockResolvedValueOnce(group);

      await service.leaveGroup(groupId, userId);

      expect(groupModel.findByIdAndUpdate).toHaveBeenCalledWith(groupId, {
        $pull: { members: userId },
      });
    });

    it('should throw an error if the group is not found', async () => {
      const groupId = 'groupId';
      const userId = 'userId';

      jest.spyOn(groupModel, 'findByIdAndUpdate').mockResolvedValueOnce(null);

      await expect(service.leaveGroup(groupId, userId)).rejects.toThrowError(
        'Group not found.',
      );

      expect(groupModel.findByIdAndUpdate).toHaveBeenCalledWith(groupId, {
        $pull: { members: userId },
      });
    });
  });
});
