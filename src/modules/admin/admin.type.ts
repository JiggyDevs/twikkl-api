import { Response } from 'express';
import { CreateAdminDto } from './dto/create-admin-dto.dto';
import { AdminLoginDto } from './dto/login-admin-dto';
import { UpdateAdminPasswordDto } from './dto/update-admin-password.dto';
import { Admin } from './entities/admin.entity';

export enum AdminStatus {
  ACCEPTED = 'accepted',
  PENDING = 'pending',
  TERMINATED = 'terminated',
}

export enum AdminRole {
  ADMIN = 'admin',
  SUPERADMIN = 'super-admin',
}

export type ICreateAdmin = CreateAdminDto & {
  admin?: number | Admin;
};

export type IUpdateAdminPassword = UpdateAdminPasswordDto;

export type ILoginAdmin = AdminLoginDto & {
  res: Response;
};
