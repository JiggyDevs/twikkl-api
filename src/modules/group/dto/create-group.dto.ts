import { IsNotEmpty, IsEmpty, IsString } from 'class-validator';

export class CreateGroupDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  description: string;
  @IsEmpty()
  creator: string;
  coverImg?: string;
  avatar?: string;
}
