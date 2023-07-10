import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  contentUrl: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  groupId: string
}
