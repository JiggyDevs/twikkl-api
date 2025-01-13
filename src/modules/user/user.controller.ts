import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { StrictAuthGuard } from 'src/middleware-guards/auth-guard.middleware';
import { Request, Response } from 'express';
import {
  FindByUserId,
  ICreateTransactionPin,
  IGetAllUsers,
  IGetUser,
  ISetNotifications,
  IUpdateTransactionPin,
  IUpdateUserProfile,
} from './user.type';
import { SetNotificationsDto, UpdateUserDto } from './dto/update-user.dto';
import {
  CreateTransactionPinDto,
  UpdateTransactionPinDto,
} from './dto/create-pin.dto';
@Controller('users')
export class UserController {
  constructor(private service: UserService) {}

  @Get('/')
  @UseGuards(StrictAuthGuard)
  async getAllUsers(@Res() res: Response, @Query() query: any) {
    const payload: IGetAllUsers = { ...query };

    const response = await this.service.getAllUsers(payload);
    return res.status(response.status).json(response);
  }

  @Get('/:userId')
  @UseGuards(StrictAuthGuard)
  async getUser(@Res() res: Response, @Param() params: FindByUserId) {
    const { userId } = params;
    const payload: IGetUser = { userId };

    const response = await this.service.getUser(payload);
    return res.status(response.status).json(response);
  }

  @Patch('/profile')
  @UseGuards(StrictAuthGuard)
  async updateProfile(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: UpdateUserDto,
  ) {
    const userId = req.user._id;
    const payload: IUpdateUserProfile = { userId, ...body };

    const response = await this.service.updateUserProfile(payload);
    return res.status(response.status).json(response);
  }

  @Patch('/notifications')
  @UseGuards(StrictAuthGuard)
  async setNotifications(
    @Res() res: Response,
    @Req() req: Request,
    @Body() body: SetNotificationsDto,
  ) {
    const userId = req.user._id;
    const payload: ISetNotifications = { ...body, userId };

    const response = await this.service.setNotifications(payload);
    return res.status(response.status).json(response);
  }

  @Patch('/transaction-pin')
  @UseGuards(StrictAuthGuard)
  async createTransactionPin(
    @Res() res: Response,
    @Req() req: Request,
    @Body() body: CreateTransactionPinDto,
  ) {
    const userId = req.user._id;
    const payload: ICreateTransactionPin = { userId, ...body };

    const response = await this.service.createTransactionPin(payload);
    return res.status(response.status).json(response);
  }

  @Patch('/transaction-pin/update')
  @UseGuards(StrictAuthGuard)
  async updateTransactionPin(
    @Res() res: Response,
    @Req() req: Request,
    @Body() body: UpdateTransactionPinDto,
  ) {
    const userId = req.user._id;
    const payload: IUpdateTransactionPin = { userId, ...body };

    const response = await this.service.updateTransactionPin(payload);
    return res.status(response.status).json(response);
  }
}
