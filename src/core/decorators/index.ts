import { SetMetadata } from '@nestjs/common';

export const isAdmin = (isAdmin?: boolean) => SetMetadata('is-admin', isAdmin);
