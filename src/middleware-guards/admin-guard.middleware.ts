import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
  HttpException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IDataServices } from 'src/core/abstracts';
import { UnAuthorizedException } from 'src/lib/exceptions';
import jwtLib from 'src/lib/jwtLib';
import { isEmpty } from 'src/lib/utils';
import { AdminStatus } from 'src/modules/admin/admin.type';
import { Admin } from 'src/modules/admin/entities/admin.entity';

@Injectable()
export class IsAdminGuard implements CanActivate {
  public constructor(
    private readonly reflector: Reflector,
    private readonly data: IDataServices,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const decoratorHandler = this.reflector.get<string>(
        'is-admin',
        context.getHandler(),
      );
      if (isEmpty(decoratorHandler)) {
        return true;
      }

      const request: any = context.switchToHttp().getRequest();
      let token: string = request.headers.authorization;
      if (!token) {
        throw new UnAuthorizedException('Unauthorized');
      }
      token = token.replace('Bearer ', '');

      const decoded = await jwtLib.jwtVerify(token);
      if (!decoded) {
        throw new UnAuthorizedException('Unauthorized');
      }

      const admin: Admin = await this.data.admin.findOne({ id: decoded._id });
      if (isEmpty(admin)) {
        throw new ForbiddenException(
          'Not enough privileges or authorized to perform this action',
        );
      }

      if (admin.status !== AdminStatus.ACCEPTED) {
        throw new UnAuthorizedException('Unauthorized');
      }

      request.admin = admin;
      return true;
    } catch (error) {
      Logger.error(error);
      throw new HttpException(error, error.status);
    }
  }
}
