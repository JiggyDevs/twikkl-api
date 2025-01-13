import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTransactionPinDto {
  @IsNotEmpty()
  @IsString()
  pin: string;
}

export class UpdateTransactionPinDto {
  @IsNotEmpty()
  @IsString()
  oldPin: string;

  @IsNotEmpty()
  @IsString()
  pin: string;
}
