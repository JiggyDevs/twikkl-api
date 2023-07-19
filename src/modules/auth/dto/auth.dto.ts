import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SignUpDto {
    @IsNotEmpty()
    @IsString()
    username: string

    @IsNotEmpty()
    @IsString()
    email: string

    @IsNotEmpty()
    @IsString()
    password: string
}

export class LoginDto {
    @IsOptional()
    @IsString()
    email: string

    @IsOptional()
    @IsString()
    username: string

    @IsNotEmpty()
    @IsString()
    password: string
}

export class RecoverPasswordDto {
    @IsNotEmpty()
    @IsString()
    email: string

    @IsOptional()
    @IsString()
    code: string
}

export class ResetPasswordDto {
    @IsNotEmpty()
    @IsString()
    email: string

    @IsNotEmpty()
    @IsString()
    password: string

    @IsNotEmpty()
    @IsString()
    token: string
}