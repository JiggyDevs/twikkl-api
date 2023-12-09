import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from './notification-services.service';
import { StrictAuthGuard } from 'src/middleware-guards/auth-guard.middleware';
import { Response } from 'express';
import { FindByUserId } from '../user/user.type';
import {
  FindByNotificationId,
  IClickAllNotifications,
  IClickedNotification,
  IGetNotifications,
} from './notification.type';
import { MarkAllNotificationsDto } from './dto/mark-all-notifications.dto';

@Controller('/notifications')
export class NotificationController {
  constructor(private service: NotificationService) {}

  @Get('/:userId')
  @UseGuards(StrictAuthGuard)
  async getAllNotifications(
    @Res() res: Response,
    @Query() query: any,
    @Param() param: FindByUserId,
  ) {
    const { userId } = param;
    query = { ...query, user: userId };
    const payload: IGetNotifications = { ...query };

    const response = await this.service.getNotifications(payload);
    return res.status(response.status).json(response);
  }

  @Patch('/:notificationId')
  @UseGuards(StrictAuthGuard)
  async clickOnNotification(
    @Res() res: Response,
    @Param() param: FindByNotificationId,
  ) {
    const { notificationId } = param;
    const payload: IClickedNotification = { notificationId };

    const response = await this.service.clickOnNotification(payload);
    return res.status(response.status).json(response);
  }

  @Patch('/')
  @UseGuards(StrictAuthGuard)
  async markAllAsRead(
    @Res() res: Response,
    @Body() body: MarkAllNotificationsDto,
  ) {
    const payload: IClickAllNotifications = { ...body };

    const response = await this.service.markAllNotificationsAsRead(payload);
    return res.status(response.status).json(response);
  }
}
