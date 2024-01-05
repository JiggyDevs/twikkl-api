import { IsNotEmpty, IsString } from 'class-validator';

export class AdminLoginDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
