import { IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    avatar: string

    @IsOptional()
    @IsString()
    bio: string

    @IsOptional()
    @IsString()
    twitter: string
}
