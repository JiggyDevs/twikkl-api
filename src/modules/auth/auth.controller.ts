import { Body, Controller, Get, Param, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RecoverPasswordDto, ResetPasswordDto, SignUpDto } from './dto/auth.dto';
import { ILogin, IRecoverPassword, IResetPassword, ISignUp } from './types/auth.types';
import { Response } from 'express';
import { StrictAuthGuard } from 'src/middleware-guards/auth-guard.middleware';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  async signUp(@Res() res: Response, @Body() body: SignUpDto) {
    const payload: ISignUp = { ...body,  res }

    const response = await this.authService.signUp(payload)
    return res.status(response.status).json(response)
  }

  @Post('/login')
  async login(@Res() res: Response, @Body() body: LoginDto) {
    const payload: ILogin = { ...body, res }

    const response = await this.authService.login(payload)
    return res.status(response.status).json(response)
  }

  @Get('/me/:userId')
  @UseGuards(StrictAuthGuard)
  async getCurrentUser(@Res() res: Response, @Param() param: any) {
    const { userId } = param

    const response = await this.authService.authUser(userId)
    return res.status(response.status).json(response)
  }

  @Post('/recover-password')
  async recoverPassword(@Res() res: Response, @Body() body: RecoverPasswordDto) {
    const payload: IRecoverPassword = { ...body }

    const response = await this.authService.recoverPassword(payload)
    return res.status(response.status).json(response)
  }

  @Post('/reset-password')
  async resetPassword(@Res() res: Response, @Body() body: ResetPasswordDto) {
    const payload: IResetPassword = { ...body, res }

    const response = await this.authService.resetpassword(payload)
    return res.status(response.status).json(response)
  }

  // @HttpCode(HttpStatus.OK)
  // @Post('login')
  // async signIn(
  //   @Body() signInDto: SigninRequestDto,
  // ): Promise<SigninResponseDto> {
  //   const user = await this.authService.signIn(
  //     signInDto.username,
  //     signInDto.password,
  //   );
  //   if (!user) {
  //     throw new HttpException(
  //       'Unauthorized: Invalid username or password',
  //       HttpStatus.UNAUTHORIZED,
  //     );
  //   }

  //   return user;
  // }

  // @HttpCode(HttpStatus.CREATED)
  // @Post('register')
  // async signUp(@Body() signUpDto: CreateUserDto) {
  //   const user = await this.authService.signUp(signUpDto);
  //   return user;
  // }
}
