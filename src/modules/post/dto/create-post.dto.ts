import { IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  caption: string;

  @IsNotEmpty()
  author: string;
}
