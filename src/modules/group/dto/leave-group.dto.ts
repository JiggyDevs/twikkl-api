import { IsNotEmpty } from 'class-validator';

export class LeaveGroupDto {
  @IsNotEmpty()
  groupId: string;

  @IsNotEmpty()
  userId: string;
}
