import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { FavoriteGroupsService } from './favorite-group.service';
import { StrictAuthGuard } from 'src/middleware-guards/auth-guard.middleware';
import { Request, Response } from 'express';
import { AddGroupToFavoritesDto } from './dto/create-group.dto';
import {
  IAddGroupToFavorites,
  IGetAllUserFavoriteGroups,
  IRemoveGroupFromFavorites,
} from './group.type';

@Controller('/favorite-groups')
export class FavoriteGroupsController {
  constructor(private service: FavoriteGroupsService) {}

  @Post('/')
  @UseGuards(StrictAuthGuard)
  async addGroupToFavorites(
    @Res() res: Response,
    @Req() req: Request,
    @Body() body: AddGroupToFavoritesDto,
  ) {
    const userId = req.user._id;
    const payload: IAddGroupToFavorites = { userId, ...body };

    const response = await this.service.addGroupToFavorites(payload);
    return res.status(response.status).json(response);
  }

  @Get('/')
  @UseGuards(StrictAuthGuard)
  async getAllUserFavoriteGroups(
    @Res() res: Response,
    @Req() req: Request,
    @Query() query: any,
  ) {
    const userId = req.user._id;
    query = { user: userId };
    const payload: IGetAllUserFavoriteGroups = { ...query };

    const response = await this.service.getAllUserFavoriteGroups(payload);
    return res.status(response.status).json(response);
  }

  //   @Get('/:groupId')
  //   @UseGuards(StrictAuthGuard)
  //   async getFavoriteGroup(@Res() res: Response, @Param() params: any) {
  //     const { groupId } = params;
  //     const payload: IGetFavoriteGroup = { groupId };

  //     const response = await this.service.getFavoriteGroup(payload);
  //     return res.status(response.status).json(response);
  //   }

  @Delete('/:groupId')
  @UseGuards(StrictAuthGuard)
  async removeGroupFromFavorites(@Res() res: Response, @Param() params: any) {
    const { groupId } = params;
    const payload: IRemoveGroupFromFavorites = { groupId };

    const response = await this.service.removeGroupFromFavorites(payload);
    return res.status(response.status).json(response);
  }
}
