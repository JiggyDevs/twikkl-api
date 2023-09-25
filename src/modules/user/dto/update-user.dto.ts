import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  avatar: string;

  @IsOptional()
  @IsString()
  bio: string;

  @IsOptional()
  @IsString()
  twitter: string;
}

export class SetNotificationsDto {
  @IsOptional()
  @IsBoolean()
  likesNotification: boolean;

  @IsOptional()
  @IsBoolean()
  commentsNotification: boolean;

  @IsOptional()
  @IsBoolean()
  followersNotification: boolean;

  @IsOptional()
  @IsBoolean()
  mentionsNotification: boolean;

  @IsOptional()
  @IsBoolean()
  repostNotification: boolean;
}
