import { Logger, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IDataServices } from 'src/core/abstracts';
import {
  AdminStatus,
  ICreateAdmin,
  ILoginAdmin,
  IUpdateAdminPassword,
} from './admin.type';
import { AdminAuthFactoryService } from './admin-auth-factory.service';
import {
  DAY_IN_SECONDS,
  JWT_USER_PAYLOAD_TYPE,
  RedisPrefix,
} from 'src/lib/constants';
import { randomBytes } from 'crypto';
import { compareHash, hash, isEmpty } from 'src/lib/utils';
import {
  ADMIN_FRONTEND_URL,
  DISCORD_VERIFICATION_CHANNEL_LINK,
  env,
} from 'src/config';
import { IInMemoryServices } from 'src/core/abstracts/in-memory.abstract';
import { DiscordService } from 'src/frameworks/notification-services/discord/discord-service.service';
import {
  AlreadyExistsException,
  BadRequestsException,
} from 'src/lib/exceptions';
import { AdminLoginDto } from './dto/login-admin-dto';
import { Admin } from './entities/admin.entity';
import jwtLib from 'src/lib/jwtLib';

@Injectable()
export class AdminAuthService {
  constructor(
    private data: IDataServices,
    private factory: AdminAuthFactoryService,
    private inMemoryServices: IInMemoryServices,
    private discordServices: DiscordService,
  ) {}

  async createAdmin(payload: ICreateAdmin) {
    try {
      const { email } = payload;

      const emailExists = await this.data.admin.findOne({ email });

      if (emailExists)
        throw new AlreadyExistsException('Email already exists.');

      if (!/@twikkl.io$/.test(email))
        throw new BadRequestsException('Email is invalid.');

      const factory = await this.factory.create({ ...payload });
      await this.data.admin.create(factory);

      const adminInviteRedisKey = `${RedisPrefix.adminInviteCode}/${email}`;

      const token = randomBytes(32).toString('hex');
      const hashedToken = await hash(token);

      const link = `${ADMIN_FRONTEND_URL}/admin/set-password/?email=${email}&token=${token}`;

      await Promise.all([
        this.inMemoryServices.set(
          adminInviteRedisKey,
          hashedToken,
          String(DAY_IN_SECONDS),
        ),
        this.discordServices.inHouseNotification({
          title: `Admin Invite Token :- ${env.env} environment`,
          content: `

          ACTION:- ADMIN INVITE

          MESSAGE:- Admin Invite for ${email} is ${token} and link is ${link}

          `,
          link: DISCORD_VERIFICATION_CHANNEL_LINK,
        }),
      ]);

      //SEND EMAIL
      return {
        message: `Admin user invite sent successfully.`,
        status: HttpStatus.OK,
        data: {},
      };
    } catch (error) {
      Logger.error(error);
      if (error.name === 'TypeError')
        throw new HttpException(error.message, 500);
      throw error;
    }
  }

  async updateAdminPassword(payload: IUpdateAdminPassword) {
    try {
      const { email, password, token } = payload;

      const inviteToken = `${RedisPrefix.adminInviteCode}/${email}`;

      const adminInviteToken = await this.inMemoryServices.get(inviteToken);
      if (!adminInviteToken)
        throw new BadRequestsException('Invalid or expired invite token');

      const validReset: boolean = await compareHash(
        String(token),
        adminInviteToken.toString(),
      );

      if (!validReset)
        throw new BadRequestsException('Invalid or expired invite token');

      await this.data.admin.update(
        { email },
        {
          $set: {
            password: await hash(password),
            status: AdminStatus.ACCEPTED,
          },
        },
      );

      await this.inMemoryServices.del(inviteToken);

      return {
        message: 'Admin updated password successfully',
        data: {},
        status: HttpStatus.OK,
      };
    } catch (error) {
      Logger.error(error);
      if (error.name === 'TypeError')
        throw new HttpException(error.message, 500);
      throw error;
    }
  }

  async login(payload: ILoginAdmin) {
    try {
      const { email, password, res } = payload;

      const admin = await this.data.admin.findOne({ email });

      if (admin.status === AdminStatus.TERMINATED)
        throw new BadRequestsException('Account terminated.');

      if (isEmpty(admin))
        throw new BadRequestsException('Email or password incorrect');

      if (isEmpty(admin?.password))
        throw new BadRequestsException('Reset password.');

      const correctPassword: boolean = await compareHash(
        password,
        admin?.password,
      );
      if (!correctPassword)
        throw new BadRequestsException('Email or password incorrect.');

      const data: JWT_USER_PAYLOAD_TYPE = {
        _id: admin?._id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
      };

      const token = await jwtLib.jwtSign(data);
      res.set('Authorization', `Bearer ${token}`);

      return {
        status: HttpStatus.OK,
        message: 'Admin logged in successfully',
        token: `Bearer ${token}`,
        data,
      };
    } catch (error) {
      Logger.error(error);
      if (error.name === 'TypeError')
        throw new HttpException(error.message, 500);
      throw error;
    }
  }
}
