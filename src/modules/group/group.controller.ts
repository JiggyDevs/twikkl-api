import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { AuthGuard } from '../auth/auth.guard';
import { JoinGroupDto } from './dto/join-group.dto';
import { LeaveGroupDto } from './dto/leave-group.dto';
import { StrictAuthGuard } from 'src/middleware-guards/auth-guard.middleware';

@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  @UseGuards(StrictAuthGuard)
  create(
    @Request() req,
    @Body() createGroupDto: Omit<CreateGroupDto, 'createdBy'>,
  ) {
    return this.groupService.create({
      ...createGroupDto,
      createdBy: req.user.sub,
    });
  }

  @Get()
  @UseGuards(StrictAuthGuard)
  findAll(@Query('ids') ids?: string) {
    const idArray = ids?.split(',') ?? [];
    return this.groupService.find(ids);
  }

  @Get(':id')
  @UseGuards(StrictAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.groupService.find(id);
  }

  // @Post(':groupId/members/:userId')
  // async addUserToGroup(
  //   @Param('groupId') groupId: string,
  //   @Param('userId') userId: string,
  // ) {
  //   const group = await this.groupService.joinGroup(groupId, userId);
  //   return group;
  // }

  @Post('/join')
  @UseGuards(StrictAuthGuard)
  async joinGroup(@Body() joinGroupDto: JoinGroupDto) {
    return this.groupService.joinGroup(joinGroupDto);
  }

  @Post('/leave')
  @UseGuards(StrictAuthGuard)
  async leaveGroup(@Body() leaveGroupDto: LeaveGroupDto) {
    return this.groupService.leaveGroup(leaveGroupDto);
  }

  @Patch(':id')
  @UseGuards(StrictAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    return this.groupService.update(id, updateGroupDto);
  }

  // @Delete(':groupId/members/:userId')
  // async leaveGroup(
  //   @Param('groupId') groupId: string,
  //   @Param('userId') userId: string,
  // ) {
  //   await this.groupService.leaveGroup(groupId, userId);
  //   return { message: 'User has left the group successfully.' };
  // }

  @Delete(':id')
  @UseGuards(StrictAuthGuard)
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.groupService.remove(id);
  }
}
