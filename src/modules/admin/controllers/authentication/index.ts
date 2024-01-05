import { Body, Controller, Param, Patch, Post, Req, Res } from '@nestjs/common';
import { AdminAuthService } from '../../admin-auth.service';
import { isAdmin } from 'src/core/decorators';
import { Request, Response } from 'express';
import { CreateAdminDto } from '../../dto/create-admin-dto.dto';
import {
  ICreateAdmin,
  ILoginAdmin,
  IUpdateAdminPassword,
} from '../../admin.type';
import { UpdateAdminPasswordDto } from '../../dto/update-admin-password.dto';
import { AdminLoginDto } from '../../dto/login-admin-dto';

@Controller('/admin')
export class AdminAuthController {
  constructor(private service: AdminAuthService) {}

  @Post('/create')
  //   @isAdmin(true)
  async createAdmin(
    @Res() res: Response,
    @Req() req: Request,
    @Body() body: CreateAdminDto,
  ) {
    // const admin = req.admin;
    const payload: ICreateAdmin = { ...body };

    const response = await this.service.createAdmin(payload);
    return res.status(response.status).json(response);
  }

  @Patch('/update-password')
  async updateAdminPassword(
    @Res() res: Response,
    @Body() body: UpdateAdminPasswordDto,
  ) {
    const payload: IUpdateAdminPassword = { ...body };

    const response = await this.service.updateAdminPassword(payload);
    return res.status(response.status).json(response);
  }

  @Post('/login')
  async login(@Res() res: Response, @Body() body: AdminLoginDto) {
    const payload: ILoginAdmin = { ...body, res };

    const response = await this.service.login(payload);
    return res.status(response.status).json(response);
  }
}
