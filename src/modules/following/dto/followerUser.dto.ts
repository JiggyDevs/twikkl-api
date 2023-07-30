import { IsNotEmpty, IsString } from "class-validator";

export class FollowUserDto {
    @IsNotEmpty()
    @IsString()
    userToFollow: string
}

export class UnFollowUserDto {
    @IsNotEmpty()
    @IsString()
    userToUnFollow: string
}