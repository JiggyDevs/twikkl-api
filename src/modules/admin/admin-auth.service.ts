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
  RESET_PASSWORD_EXPIRY,
  RedisPrefix,
} from 'src/lib/constants';
import { randomBytes } from 'crypto';
import {
  compareHash,
  hash,
  isEmpty,
  randomFixedInteger,
  secondsToDhms,
} from 'src/lib/utils';
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
  DoesNotExistsException,
  TooManyRequestsException,
} from 'src/lib/exceptions';
import { AdminLoginDto } from './dto/login-admin-dto';
import { Admin } from './entities/admin.entity';
import jwtLib from 'src/lib/jwtLib';
import {
  IRecoverPassword,
  IResetAdminPassword,
  IResetPassword,
} from '../auth/types/auth.types';

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
      const { email, userName, password, res } = payload;

      if (email) {
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
          username: admin.userName,
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
      }

      if (userName) {
        const admin = await this.data.admin.findOne({ userName });

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
          username: admin.userName,
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
      }
    } catch (error) {
      Logger.error(error);
      if (error.name === 'TypeError')
        throw new HttpException(error.message, 500);
      throw error;
    }
  }

  async recoverPassword(payload: IRecoverPassword) {
    try {
      let { email } = payload;
      const passwordResetCountKey = `${RedisPrefix.passwordResetCount}/${email}`;
      const resetCodeRedisKey = `${RedisPrefix.resetCode}/${email}`;

      const resetInPast24H = await this.inMemoryServices.get(
        passwordResetCountKey,
      );
      if (resetInPast24H) {
        const ttl = await this.inMemoryServices.ttl(passwordResetCountKey);
        const timeToRetry = Math.ceil(Number(ttl));
        const nextTryOpening = secondsToDhms(timeToRetry);
        throw new TooManyRequestsException(
          `Password was recently updated. Try again in ${nextTryOpening}`,
        );
      }

      const admin = await this.data.admin.findOne({ email });
      if (!admin) {
        throw new BadRequestsException(`code is invalid or has expired`);
      }

      const codeSent = await this.inMemoryServices.get(resetCodeRedisKey);
      if (codeSent) {
        const codeExpiry =
          ((await this.inMemoryServices.ttl(resetCodeRedisKey)) as Number) || 0;
        return {
          status: 202,
          message: `Provide the code sent to your email or request another one in ${Math.ceil(
            Number(codeExpiry) / 60,
          )} minute`,
          nextRequestInSecs: Number(codeExpiry),
        };
      }

      try {
        const phoneCode = randomFixedInteger(4);
        const hashedPhoneCode = await hash(String(phoneCode));
        await this.inMemoryServices.set(
          resetCodeRedisKey,
          hashedPhoneCode,
          String(RESET_PASSWORD_EXPIRY),
        );

        //Send to discord
        await this.discordServices.inHouseNotification({
          title: `Forgot password otp code :- ${env.env} environment`,
          content: `Provide the code sent to your email ${admin.email} \n code: ${phoneCode}`,
          link: DISCORD_VERIFICATION_CHANNEL_LINK,
        });

        return {
          status: 202,
          message: `Provide the code sent to your email - ${admin.email}`,
          code: env.isProd ? null : phoneCode,
        };
      } catch (error) {
        if (error.name === 'TypeError') {
          throw new HttpException(error.message, 500);
        }
        Logger.error(error);
        throw error;
      }
    } catch (error) {
      Logger.error(error);
      if (error.name === 'TypeError')
        throw new HttpException(error.message, 500);
      throw error;
    }
  }

  async resetpassword(payload: IResetAdminPassword) {
    try {
      const { email, password, code, res } = payload;
      const passwordResetCountKey = `${RedisPrefix.passwordResetCount}/${email}`;
      const resetCodeRedisKey = `${RedisPrefix.resetCode}/${email}`;

      const userRequestReset = await this.inMemoryServices.get(
        resetCodeRedisKey,
      );
      if (!userRequestReset)
        throw new BadRequestsException('Invalid or expired reset code');

      const admin = await this.data.admin.findOne({ email });
      if (!admin)
        throw new DoesNotExistsException('Admin user does not exists');

      // // If reset link is valid and not expired
      // const validReset = await compareHash(String(token), userRequestReset);
      // if (!validReset)
      //   throw new BadRequestsException('Invalid or expired reset token');

      const validResetCode = await compareHash(code, userRequestReset);
      if (!validResetCode)
        throw new BadRequestsException('Invalid or expired reset code');

      const hashedPassword = await hash(password);
      const twenty4H = 1 * 60 * 60 * 24;

      // Remove reset token for this user
      await this.inMemoryServices.del(resetCodeRedisKey);
      await this.inMemoryServices.set(
        passwordResetCountKey,
        1,
        String(twenty4H),
      );

      // save reset count for next 24 hours
      // remove stored cookie so it reinstate otp
      res.cookie('deviceTag', '');
      await this.data.admin.update(
        { email: admin.email },
        {
          $set: {
            password: hashedPassword,
          },
        },
      );

      return {
        status: 200,
        message: 'Password updated successfully',
        data: null,
      };
    } catch (error) {
      Logger.error(error);
      if (error.name === 'TypeError')
        throw new HttpException(error.message, 500);
      throw error;
    }
  }
}
