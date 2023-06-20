import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Controller('groups')
export class GroupController {
  constructor(private readonly groupsService: GroupService) {}

  @Post()
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.create(createGroupDto);
  }

  @Get()
  findAll(@Query('ids') ids?: string) {
    const idArray = ids?.split(',') ?? [];
    return this.groupsService.find(ids);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupsService.find(id);
  }

  @Post(':groupId/members/:userId')
  async addUserToGroup(
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
  ) {
    const group = await this.groupsService.joinGroup(groupId, userId);
    return group;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupsService.update(+id, updateGroupDto);
  }

  @Delete(':groupId/members/:userId')
  async leaveGroup(
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
  ) {
    await this.groupsService.leaveGroup(groupId, userId);
    return { message: 'User has left the group successfully.' };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupsService.remove(+id);
  }
}
