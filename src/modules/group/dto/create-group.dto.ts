import { IsNotEmpty, IsEmpty, IsString } from 'class-validator';

export class CreateGroupDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsEmpty()
  creator: string;
  coverImg?: string;
  avatar?: string;
}

export class AddGroupToFavoritesDto {
  @IsNotEmpty()
  @IsString()
  groupId: string;
}
