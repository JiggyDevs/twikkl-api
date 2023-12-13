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
  Req,
  Res,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { AuthGuard } from '../auth/auth.guard';
import { JoinGroupDto } from './dto/join-group.dto';
import { LeaveGroupDto } from './dto/leave-group.dto';
import { Request, Response } from 'express';
import { StrictAuthGuard } from 'src/middleware-guards/auth-guard.middleware';
import {
  ICreateGroup,
  IGetGroup,
  IGetGroupPosts,
  IGetGroups,
  IGetUserGroup,
  IGroupAction,
} from './group.type';

@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post('/')
  @UseGuards(StrictAuthGuard)
  async create(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: CreateGroupDto,
  ) {
    const userId = req.user._id;
    const payload: ICreateGroup = { ...body, creator: userId };
    const response = await this.groupService.create(payload);
    return res.status(response.status).json(response);
  }

  @Get('/')
  @UseGuards(StrictAuthGuard)
  async findAll(
    @Req() req: Request,
    @Res() res: Response,
    @Query() query: any,
  ) {
    const userId = req.user._id;
    query = { isDeleted: false };
    const payload: IGetGroups = { ...query };

    const response = await this.groupService.find(payload);
    return res.status(response.status).json(response);
  }

  @Get('/user')
  @UseGuards(StrictAuthGuard)
  async getUserGroups(@Req() req: Request, @Res() res: Response) {
    const userId = req.user._id;
    const payload: IGetUserGroup = { userId };
    const response = await this.groupService.getUserGroups(payload);
    return res.status(response.status).json(response);
  }

  @Get('/:groupId')
  @UseGuards(StrictAuthGuard)
  async findOne(@Res() res: Response, @Param() param: IGetGroup) {
    const { groupId } = param;
    const payload: IGetGroup = { groupId };

    const response = await this.groupService.findOne(payload);
    return res.status(response.status).json(response);
  }

  @Get('/:groupId/posts')
  @UseGuards(StrictAuthGuard)
  async getGroupPosts(@Res() res: Response, @Param() param: IGetGroup) {
    const { groupId } = param;
    const payload: IGetGroupPosts = {
      groupId,
      perpage: '10',
      page: '1',
      sort: '-1',
      q: '',
    };

    const response = await this.groupService.getGroupPosts(payload);
    return res.status(response.status).json(response);
  }

  @Get('/:groupId/members')
  @UseGuards(StrictAuthGuard)
  async getGroupMembers(@Res() res: Response, @Param() param: IGetGroup) {
    const { groupId } = param;
    const payload: IGetGroup = { groupId };
    const response = await this.groupService.getGroupMembers(payload);
    return res.status(response.status).json(response);
  }

  @Post('/join')
  @UseGuards(StrictAuthGuard)
  async joinGroup(
    @Req() req: Request,
    @Res() res: Response,
    @Body() joinGroupDto: JoinGroupDto,
  ) {
    const userId = req.user._id;
    const payload: IGroupAction = { userId, ...joinGroupDto };
    const response = await this.groupService.joinGroup(payload);
    return res.status(response.status).json(response);
  }

  @Post('/leave')
  @UseGuards(StrictAuthGuard)
  async leaveGroup(
    @Req() req: Request,
    @Res() res: Response,
    @Body() leaveGroupDto: LeaveGroupDto,
  ) {
    const userId = req.user._id;
    const payload: IGroupAction = { userId, ...leaveGroupDto };
    const response = await this.groupService.leaveGroup(payload);
    return res.status(response.status).json(response);
  }

  // @Patch('/:id')
  // update(
  //   @Param('id', ParseIntPipe) id: string,
  //   @Body() updateGroupDto: UpdateGroupDto,
  // ) {
  //   return this.groupService.update(id, updateGroupDto);
  // }

  @Delete('/:groupId')
  @UseGuards(StrictAuthGuard)
  async deleteGroup(
    @Req() req: Request,
    @Res() res: Response,
    @Param() param: IGetGroup,
  ) {
    const userId = req.user._id;
    const { groupId } = param;
    const payload: IGroupAction = { userId, groupId };

    const response = await this.groupService.deleteGroup(payload);
    return res.status(response.status).json(response);
  }
}
