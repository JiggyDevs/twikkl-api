import { IsNumberString } from 'class-validator';

export class GetPostDto {
  @IsNumberString()
  id: string;
}
