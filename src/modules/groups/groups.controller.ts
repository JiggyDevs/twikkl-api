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
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.create(createGroupDto);
  }

  @Get()
  findAll(@Query('ids') ids: string) {
    const idArray = ids.split(',');
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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupsService.remove(+id);
  }
}
