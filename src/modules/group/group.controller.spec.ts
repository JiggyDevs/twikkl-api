import { Test, TestingModule } from '@nestjs/testing';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group } from './schemas/group.schema';

describe('GroupController', () => {
  let controller: GroupController;
  let groupsService: GroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupController],
      providers: [GroupService],
    }).compile();

    controller = module.get<GroupController>(GroupController);
    groupsService = module.get<GroupService>(GroupService);
  });

  describe('create', () => {
    it('should call groupsService.create and return the result', () => {
      const createGroupDto: CreateGroupDto = {
        // provide necessary data for the createGroupDto
      };

      const expectedResult = 'This action adds a new group';
      jest.spyOn(groupsService, 'create').mockReturnValueOnce(expectedResult);

      const result = controller.create(createGroupDto);

      expect(groupsService.create).toHaveBeenCalledWith(createGroupDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should call groupsService.find with ids and return the result', () => {
      const ids = 'id1,id2,id3';
      const idArray = ids.split(',');

      const expectedResult = []; // provide expected result here
      jest.spyOn(groupsService, 'find').mockResolvedValueOnce(expectedResult);

      const result = controller.findAll(ids);

      expect(groupsService.find).toHaveBeenCalledWith(idArray);
      expect(result).resolves.toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should call groupsService.find with id and return the result', () => {
      const id = 'groupId';

      const expectedResult = [{}] as Group[]; // provide expected result here
      jest.spyOn(groupsService, 'find').mockResolvedValueOnce(expectedResult);

      const result = controller.findOne(id);

      expect(groupsService.find).toHaveBeenCalledWith(id);
      expect(result).resolves.toEqual(expectedResult);
    });
  });

  describe('addUserToGroup', () => {
    it('should call groupsService.joinGroup with groupId and userId and return the result', async () => {
      const groupId = 'groupId';
      const userId = 'userId';

      const expectedResult = {} as Group; // provide expected result here
      jest
        .spyOn(groupsService, 'joinGroup')
        .mockResolvedValueOnce(expectedResult);

      const result = await controller.addUserToGroup(groupId, userId);

      expect(groupsService.joinGroup).toHaveBeenCalledWith(groupId, userId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should call groupsService.update with id and updateGroupDto and return the result', () => {
      const id = 'groupId';
      const updateGroupDto: UpdateGroupDto = {
        // provide necessary data for the updateGroupDto
      };

      const expectedResult = `This action updates a #${id} group`;
      jest.spyOn(groupsService, 'update').mockReturnValueOnce(expectedResult);

      const result = controller.update(id, updateGroupDto);

      expect(groupsService.update).toHaveBeenCalledWith(id, updateGroupDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('leaveGroup', () => {
    it('should call groupsService.leaveGroup with groupId and userId and return a success message', async () => {
      const groupId = 'groupId';
      const userId = 'userId';

      jest.spyOn(groupsService, 'leaveGroup');

      const result = await controller.leaveGroup(groupId, userId);

      expect(groupsService.leaveGroup).toHaveBeenCalledWith(groupId, userId);
      expect(result).toEqual({
        message: 'User has left the group successfully.',
      });
    });
  });

  describe('remove', () => {
    it('should call groupsService.remove with id and return the result', () => {
      const id = 'groupId';

      const expectedResult = `This action removes a #${id} group`;
      jest.spyOn(groupsService, 'remove').mockReturnValueOnce(expectedResult);

      const result = controller.remove(id);

      expect(groupsService.remove).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedResult);
    });
  });
});
