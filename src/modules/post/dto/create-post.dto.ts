import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PostVisibilityEnum } from '../post.type';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  contentUrl: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  categoryId: string;

  @IsOptional()
  @IsArray()
  tags: string[];

  @IsOptional()
  @IsString()
  groupId: string;

  @IsOptional()
  @IsEnum(PostVisibilityEnum)
  visibility: PostVisibilityEnum;
}

export class AddTagDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  postId: string;
}

export class EditPostDto {
  @IsOptional()
  @IsBoolean()
  allowDuet: boolean;

  @IsOptional()
  @IsBoolean()
  allowStitch: boolean;

  @IsOptional()
  @IsEnum(PostVisibilityEnum)
  visibility: PostVisibilityEnum;
}
