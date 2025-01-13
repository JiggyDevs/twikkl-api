import { SetMetadata } from '@nestjs/common';

export const TransactionPinCheck = (check: boolean) =>
  SetMetadata('transaction-pin-check', check);
