import { CreateUserDto } from './../user/dto/create-user.dto';
import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninAuthDto } from './dto/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: SigninAuthDto) {
    const user = await this.authService.signIn(
      signInDto.username,
      signInDto.password,
    );
    if (!user) {
      throw new HttpException(
        'Unauthorized: Invalid username or password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return user;
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async signUp(@Body() signUpDto: CreateUserDto) {
    const user = await this.authService.signUp(signUpDto);
    return user;
  }
}
