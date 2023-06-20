import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGroupDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  createdBy: string;

  category: string;

  @IsString()
  coverImg?: string;

  @IsString()
  avatar?: string;
}
