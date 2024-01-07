import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { AdminRole } from '../admin.type';

export class CreateAdminDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  userName: string;

  // @IsNotEmpty()
  // @IsEnum(AdminRole)
  // role: AdminRole;
}
