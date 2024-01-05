import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateAdminPasswordDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  token: string;
}
