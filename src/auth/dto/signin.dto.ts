import { IsNotEmpty } from 'class-validator';
export class SigninAuthDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}
