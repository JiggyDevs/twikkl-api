import { IsNotEmpty } from 'class-validator';

export class JoinGroupDto {
  @IsNotEmpty()
  groupId: string;

  @IsNotEmpty()
  userId: string;
}
