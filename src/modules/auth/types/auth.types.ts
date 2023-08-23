import { Request, Response } from 'express';
import {
  CreateUsernameDto,
  LoginDto,
  RecoverPasswordDto,
  ResetPasswordDto,
  SignUpDto,
  VerifyEmailDto,
} from '../dto/auth.dto';
import { type } from 'os';

export type ISignUp = SignUpDto & {
  res: Response;
};

export type ILogin = LoginDto & {
  res: Response;
};

export type IRecoverPassword = RecoverPasswordDto;

export type IResetPassword = ResetPasswordDto & {
  res: Response;
};

export type IIssueEmailOtpCode = {
  req: Request;
};

export type IVerifyEmail = VerifyEmailDto & {
  req: Request;
  res: Response;
};

export type ICreateUsername = CreateUsernameDto & {
  req: Request;
};
