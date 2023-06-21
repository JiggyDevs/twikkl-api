import { IsNotEmpty } from 'class-validator';

export class FollowUserDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  userToFollowId: string;
}
