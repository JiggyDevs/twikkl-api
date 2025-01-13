import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IDataServices } from 'src/core/abstracts';
import { compareHash, isEmpty } from 'src/lib/utils';
import { User } from 'src/modules/user/entities/user.entity';

@Injectable()
export class TransactionPinGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly dataServices: IDataServices,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const decorator = this.reflector.get<string>(
        'transaction-pin-check',
        context.getHandler(),
      );
      if (isEmpty(decorator) || !decorator) return true;

      const request = context.switchToHttp().getRequest();

      const user = request.user;
      if (!user) throw new NotFoundException('User not found');

      const userData = await this.dataServices.users.findOne({ _id: user._id });

      const userTransactionPin: string = userData.transactionPin;
      const transactionPin = request.body.transactionPin || request.body.pin;

      if (!transactionPin)
        throw new BadRequestException('Transaction pin required!');
      if (!userTransactionPin)
        throw new BadRequestException('Please set transaction pin.');

      const validPin = await compareHash(transactionPin, userTransactionPin);
      if (!validPin) throw new BadRequestException('Invalid transaction Pin.');

      return true;
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }
}
