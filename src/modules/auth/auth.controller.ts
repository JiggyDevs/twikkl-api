import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  CreateUsernameDto,
  LoginDto,
  RecoverPasswordDto,
  ResetPasswordDto,
  SignUpDto,
  VerifyEmailDto,
} from './dto/auth.dto';
import {
  ICreateUsername,
  IIssueEmailOtpCode,
  ILogin,
  IRecoverPassword,
  IResetPassword,
  ISignUp,
  IVerifyEmail,
} from './types/auth.types';
import { Request, Response } from 'express';
import {
  LooseAuthGuard,
  StrictAuthGuard,
} from 'src/middleware-guards/auth-guard.middleware';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  async signUp(@Res() res: Response, @Body() body: SignUpDto) {
    const payload: ISignUp = { ...body, res };

    const response = await this.authService.signUp(payload);
    return res.status(response.status).json(response);
  }

  @Get('/verify-email')
  @UseGuards(LooseAuthGuard)
  async getVerificationCode(@Req() req: Request, @Res() res: Response) {
    const payload: IIssueEmailOtpCode = { req };

    const response = await this.authService.issueEmailOtpCode(payload);
    return res.status(response.status).json(response);
  }

  @Post('/verify-email')
  @UseGuards(LooseAuthGuard)
  async verifyEmail(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: VerifyEmailDto,
  ) {
    const payload: IVerifyEmail = { req, res, ...body };

    const response = await this.authService.verifyEmail(payload);
    return res.status(response.status).json(response);
  }

  @Patch('/create-username')
  @UseGuards(LooseAuthGuard)
  async createUsername(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: CreateUsernameDto,
  ) {
    const payload: ICreateUsername = { req, ...body };

    const response = await this.authService.createUserName(payload);
    return res.status(response.status).json(response);
  }

  @Post('/login')
  async login(@Res() res: Response, @Body() body: LoginDto) {
    const payload: ILogin = { ...body, res };

    const response = await this.authService.login(payload);
    return res.status(response.status).json(response);
  }

  @Get('/me/:userId')
  @UseGuards(StrictAuthGuard)
  async getCurrentUser(@Res() res: Response, @Param() param: any) {
    const { userId } = param;

    const response = await this.authService.authUser(userId);
    return res.status(response.status).json(response);
  }

  @Post('/recover-password')
  async recoverPassword(
    @Res() res: Response,
    @Body() body: RecoverPasswordDto,
  ) {
    const payload: IRecoverPassword = { ...body };

    const response = await this.authService.recoverPassword(payload);
    return res.status(response.status).json(response);
  }

  @Post('/reset-password')
  async resetPassword(@Res() res: Response, @Body() body: ResetPasswordDto) {
    const payload: IResetPassword = { ...body, res };

    const response = await this.authService.resetpassword(payload);
    return res.status(response.status).json(response);
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
