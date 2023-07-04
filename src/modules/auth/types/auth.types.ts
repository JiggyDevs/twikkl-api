import { Response } from "express";
import { LoginDto, RecoverPasswordDto, ResetPasswordDto, SignUpDto } from "../dto/auth.dto";

export type ISignUp = SignUpDto & {
    res: Response
}

export type ILogin = LoginDto & {
    res: Response
}

export type IRecoverPassword = RecoverPasswordDto

export type IResetPassword = ResetPasswordDto & {
    res: Response
}