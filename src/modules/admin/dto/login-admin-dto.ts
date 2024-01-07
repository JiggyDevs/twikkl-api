import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AdminLoginDto {
  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  userName: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
