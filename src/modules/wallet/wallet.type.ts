import { DateType, PaginationType } from 'src/core/types/database';

export type IGetUserWallets = PaginationType &
  DateType & {
    owner: string;
    networkId: string;
    address: string;
    q?: string;
  };

export type IGetWallet = {
  id: string;
};

export type FindByIdDto = {
  id: string;
};
