import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { IDataServices } from 'src/core/abstracts';
import {
  ICreateUsername,
  IIssueEmailOtpCode,
  ILogin,
  IRecoverPassword,
  IResetPassword,
  ISignUp,
  IVerifyEmail,
} from './types/auth.types';
import {
  AlreadyExistsException,
  BadRequestsException,
  DoesNotExistsException,
  TooManyRequestsException,
} from 'src/lib/exceptions';
import { OptionalQuery } from 'src/core/types/database';
import { User } from '../user/entities/user.entity';
import {
  compareHash,
  hash,
  isEmpty,
  maybePluralize,
  randomFixedInteger,
  secondsToDhms,
} from 'src/lib/utils';
import { UserFactoryService } from '../user/user-factory.service';
import {
  INCOMPLETE_AUTH_TOKEN_VALID_TIME,
  JWT_USER_PAYLOAD_TYPE,
  RESET_PASSWORD_EXPIRY,
  RedisPrefix,
  SIGNUP_CODE_EXPIRY,
} from 'src/lib/constants';
import jwtLib from 'src/lib/jwtLib';
import { IInMemoryServices } from 'src/core/abstracts/in-memory.abstract';
import { randomBytes } from 'crypto';
import { DISCORD_VERIFICATION_CHANNEL_LINK, env } from 'src/config';
import { DiscordService } from 'src/frameworks/notification-services/discord/discord-service.service';

@Injectable()
export class AuthService {
  constructor(
    private data: IDataServices,
    private userFactory: UserFactoryService,
    private inMemoryServices: IInMemoryServices,
    private discordServices: DiscordService,
  ) {}

  async signUp(payload: ISignUp) {
    try {
      const { email, password, res } = payload;

      const emailExists = await this.data.users.findOne({ email });
      if (emailExists) {
        throw new AlreadyExistsException(
          'User with that email already exists!',
        );
      }

      // const usernameExists = await this.data.users.findOne({ username });
      // if (usernameExists) {
      //   throw new AlreadyExistsException('Username already in use');
      // }

      const hashedPassword = await hash(password);

      const userPayload: OptionalQuery<User> = {
        // username,
        email,
        password: hashedPassword,
        lastLoginDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const userFactory = this.userFactory.create(userPayload);
      const user = await this.data.users.create(userFactory);

      const jwtPayload: JWT_USER_PAYLOAD_TYPE = {
        _id: user?._id,
        email: user?.email,
        username: user.username,
        emailVerified: user?.emailVerified,
      };

      const token = (await jwtLib.jwtSign(
        jwtPayload,
        `${INCOMPLETE_AUTH_TOKEN_VALID_TIME}h`,
      )) as string;
      res.set('Authorization', `Bearer ${token}`);

      return {
        message: 'User signed up successfully',
        token: `Bearer ${token}`,
        data: jwtPayload,
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      Logger.error(error);
      if (error.name === 'TypeError')
        throw new HttpException(error.message, 500);
      throw error;
    }
  }

  async issueEmailOtpCode(payload: IIssueEmailOtpCode) {
    try {
      const { req } = payload;

      const authUser = req.user;
      if (!authUser) {
        throw new BadRequestsException('User not recognized');
      }
      if (authUser?.emailVerified) {
        throw new AlreadyExistsException('user email already verified');
      }

      const redisKey = `${RedisPrefix.signupEmailCode}/${authUser?.email}`;
      const codeSent = (await this.inMemoryServices.get(redisKey)) as number;

      if (codeSent) {
        const codeExpiry =
          ((await this.inMemoryServices.ttl(redisKey)) as Number) || 0;
        // taking away 4 minutes from the wait time
        const nextRequest = Math.abs(Number(codeExpiry) / 60 - 4);
        if (Number(codeExpiry && Number(codeExpiry) > 4)) {
          return {
            status: 202,
            message: `if you have not received the verification code, please make another request in ${Math.ceil(
              nextRequest,
            )} ${maybePluralize(Math.ceil(nextRequest), 'minute', 's')}`,
          };
        }
      }

      const emailCode = randomFixedInteger(6);
      // Remove email code for this user
      await this.inMemoryServices.del(redisKey);
      const user = await this.data.users.findOne({ email: authUser?.email });
      const verification: string[] = [];
      if (user?.emailVerified! === false) verification.push('email');

      if (!user) {
        throw new DoesNotExistsException('User does not exists');
      }

      // hash verification code in redis
      const hashedCode = await hash(String(emailCode));
      // save hashed code to redis
      await this.inMemoryServices.set(
        redisKey,
        hashedCode,
        String(SIGNUP_CODE_EXPIRY),
      );

      const message = `Verification code for ${user?.username}-${user?.email} is ${emailCode}`;

      //Send to Discord
      await this.discordServices.inHouseNotification({
        title: `Email Verification code :- ${env.env} environment`,
        content: message,
        link: DISCORD_VERIFICATION_CHANNEL_LINK,
      });

      //Send to Email when mailgun is configured

      return {
        status: HttpStatus.OK,
        message,
        data: env.isProd ? null : emailCode,
        verification,
      };
    } catch (error) {
      Logger.error(error);
      if (error.name === 'TypeError')
        throw new HttpException(error.message, 500);
      throw error;
    }
  }

  async verifyEmail(payload: IVerifyEmail) {
    try {
      const { code, req, res } = payload;

      const authUser = req?.user;

      const redisKey = `${RedisPrefix.signupEmailCode}/${authUser?.email}`;
      const verification: string[] = [];

      if (authUser?.emailVerified) {
        throw new AlreadyExistsException('user email already verified');
      }

      const savedCode = await this.inMemoryServices.get(redisKey);

      if (isEmpty(savedCode)) {
        console.log('code not found', savedCode);
        throw new BadRequestsException(
          'Code is incorrect, invalid or has expired',
        );
      }

      const correctCode = await compareHash(
        String(code).trim(),
        (savedCode || '').trim(),
      );
      if (!correctCode) {
        throw new BadRequestsException(
          'Code is incorrect, invalid or has expired',
        );
      }

      const updatedUser = await this.data.users.update(
        { _id: authUser?._id },
        {
          $set: {
            emailVerified: true,
            lastLoginDate: new Date(),
          },
        },
      );

      const jwtPayload: JWT_USER_PAYLOAD_TYPE = {
        _id: updatedUser?._id,
        username: updatedUser?.firstName,
        email: updatedUser?.email,
        emailVerified: updatedUser.emailVerified,
      };

      if (updatedUser?.emailVerified! === false) verification.push('email');

      const token = (await jwtLib.jwtSign(jwtPayload)) as string;
      if (!res.headersSent) res.set('Authorization', `Bearer ${token}`);

      await await this.inMemoryServices.del(redisKey);

      return {
        status: HttpStatus.OK,
        message: 'User email is verified successfully',
        token: `Bearer ${token}`,
        data: jwtPayload,
        verification,
      };
    } catch (error) {
      Logger.error(error);
      if (error.name === 'TypeError')
        throw new HttpException(error.message, 500);
      throw error;
    }
  }

  async createUserName(payload: ICreateUsername) {
    try {
      const { req, username } = payload;

      const authUser = req?.user;
      if (!authUser) throw new DoesNotExistsException('User does not exist');

      if (!authUser.emailVerified)
        throw new BadRequestsException('Email not verified');

      const usernameExists = await this.data.users.findOne({ username });
      if (usernameExists)
        throw new AlreadyExistsException('Username already in use');

      await this.data.users.update(
        { _id: authUser._id },
        {
          $set: {
            username,
          },
        },
      );

      return {
        status: HttpStatus.OK,
        message: 'Username created successfully',
        data: {},
      };
    } catch (error) {
      Logger.error(error);
      if (error.name === 'TypeError')
        throw new HttpException(error.message, 500);
      throw error;
    }
  }

  async login(payload: ILogin) {
    try {
      const { email, username, password, deviceToken, res } = payload;

      if (username) {
        const usernameExists = await this.data.users.findOne({ username });
        if (!usernameExists)
          throw new DoesNotExistsException('Invalid username or password');

        const verification: string[] = [];

        if (!usernameExists?.emailVerified) {
          verification.push('email');
          const jwtPayload: JWT_USER_PAYLOAD_TYPE = {
            _id: usernameExists?._id,
            username: usernameExists?.firstName,
            email: usernameExists?.email,
            emailVerified: usernameExists.emailVerified,
          };

          const token = await jwtLib.jwtSign(
            jwtPayload,
            `${INCOMPLETE_AUTH_TOKEN_VALID_TIME}h`,
          );
          return {
            status: 403,
            message: 'email is not verified',
            token: `Bearer ${token}`,
            verification,
          };
        }

        const validPassword: boolean = await compareHash(
          password,
          usernameExists?.password,
        );
        if (!validPassword)
          throw new BadRequestException('Invalid username or password');

        const jwtPayload: JWT_USER_PAYLOAD_TYPE = {
          _id: usernameExists?._id,
          email: usernameExists.email,
          username: usernameExists.username,
          emailVerified: usernameExists.emailVerified,
        };

        const token = await jwtLib.jwtSign(jwtPayload);
        res.set('Authorization', `Bearer ${token}`);

        await this.data.users.update(
          { _id: usernameExists._id },
          { $set: { lastLoginDate: new Date() } },
        );

        if (deviceToken) {
          await this.data.users.update(
            { _id: usernameExists._id },
            { $set: { deviceToken } },
          );
        }

        return {
          status: HttpStatus.OK,
          message: 'User logged in successfully',
          token: `Bearer ${token}`,
          data: jwtPayload,
        };
      }

      if (email) {
        const emailExists = await this.data.users.findOne({ email });
        if (!emailExists)
          throw new DoesNotExistsException('Invalid email or password');

        const verification: string[] = [];

        if (!emailExists?.emailVerified) {
          verification.push('email');
          const jwtPayload: JWT_USER_PAYLOAD_TYPE = {
            _id: emailExists?._id,
            username: emailExists?.firstName,
            email: emailExists?.email,
            emailVerified: emailExists.emailVerified,
          };

          const token = await jwtLib.jwtSign(
            jwtPayload,
            `${INCOMPLETE_AUTH_TOKEN_VALID_TIME}h`,
          );
          return {
            status: 403,
            message: 'email is not verified',
            token: `Bearer ${token}`,
            verification,
          };
        }

        const validPassword: boolean = await compareHash(
          password,
          emailExists?.password,
        );
        if (!validPassword)
          throw new BadRequestException('Invalid email or password');

        const jwtPayload: JWT_USER_PAYLOAD_TYPE = {
          _id: emailExists?._id,
          email: emailExists.email,
          username: emailExists.username,
          emailVerified: emailExists.emailVerified,
        };

        const token = await jwtLib.jwtSign(jwtPayload);
        res.set('Authorization', `Bearer ${token}`);

        await this.data.users.update(
          { _id: emailExists._id },
          { $set: { lastLoginDate: new Date() } },
        );

        if (deviceToken) {
          await this.data.users.update(
            { _id: emailExists._id },
            { $set: { deviceToken } },
          );
        }

        return {
          status: HttpStatus.OK,
          message: 'User logged in successfully',
          token: `Bearer ${token}`,
          data: jwtPayload,
        };
      }
    } catch (error) {
      Logger.error(error);
      if (error.name === 'TypeError')
        throw new HttpException(error.message, 500);
      throw error;
    }
  }

  async authUser(userId: string) {
    try {
      const user = await this.data.users.findOne({ _id: userId }, null, {
        select: ['-password'],
      });
      return {
        status: HttpStatus.OK,
        message: 'User retrieved successfully',
        data: user,
      };
    } catch (error) {
      Logger.error(error);
      if (error.name === 'TypeError')
        throw new HttpException(error.message, 500);
      throw error;
    }
  }

  async recoverPassword(payload: IRecoverPassword) {
    try {
      let { email, code } = payload;
      const passwordResetCountKey = `${RedisPrefix.passwordResetCount}/${email}`;
      const resetPasswordRedisKey = `${RedisPrefix.resetpassword}/${email}`;
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

      const user = await this.data.users.findOne({ email });
      if (!user) {
        throw new BadRequestsException(`code is invalid or has expired`);
      }

      const codeSent = await this.inMemoryServices.get(resetCodeRedisKey);
      if (!code) {
        if (codeSent) {
          const codeExpiry =
            ((await this.inMemoryServices.ttl(resetCodeRedisKey)) as Number) ||
            0;
          return {
            status: 202,
            message: `Provide the code sent to your email or request another one in ${Math.ceil(
              Number(codeExpiry) / 60,
            )} minute`,
            nextRequestInSecs: Number(codeExpiry),
          };
        }

        try {
          const phoneCode = randomFixedInteger(6);
          const hashedPhoneCode = await hash(String(phoneCode));
          await this.inMemoryServices.set(
            resetCodeRedisKey,
            hashedPhoneCode,
            String(RESET_PASSWORD_EXPIRY),
          );

          //Send to discord
          await this.discordServices.inHouseNotification({
            title: `Forgot password otp code :- ${env.env} environment`,
            content: `Provide the code sent to your mobile number \n code: ${phoneCode}`,
            link: DISCORD_VERIFICATION_CHANNEL_LINK,
          });

          return {
            status: 202,
            message: 'Provide the code sent to your mobile number',
            code: env.isProd ? null : phoneCode,
          };
        } catch (error) {
          if (error.name === 'TypeError') {
            throw new HttpException(error.message, 500);
          }
          Logger.error(error);
          throw error;
        }
      } else {
        const phoneVerifyDocument = codeSent as string;
        if (isEmpty(phoneVerifyDocument)) {
          throw new BadRequestsException(`code is invalid or has expired`);
        }
        const correctCode = await compareHash(
          String(code).trim(),
          (phoneVerifyDocument || '').trim(),
        );
        if (!correctCode) {
          throw new BadRequestsException(`code is invalid or has expired`);
        }

        // Generate Reset token
        const resetToken = randomBytes(32).toString('hex');
        const hashedResetToken = await hash(resetToken);

        // Remove all reset token for this user if it exists
        await this.inMemoryServices.del(resetCodeRedisKey);
        await this.inMemoryServices.del(resetPasswordRedisKey);

        await this.inMemoryServices.set(
          resetPasswordRedisKey,
          hashedResetToken,
          String(RESET_PASSWORD_EXPIRY),
        );

        await this.discordServices.inHouseNotification({
          title: `Recover password token :- ${env.env} environment`,
          content: `You will receive an email with a link to reset your password if you have an account with this email \n ${resetToken}`,
          link: DISCORD_VERIFICATION_CHANNEL_LINK,
        });

        return {
          status: 200,
          message:
            'You will receive an email with a link to reset your password if you have an account with this email.',
          resetSecret: env.isProd ? null : resetToken,
          resetToken: env.isProd ? null : resetToken,
        };
      }
    } catch (error) {
      Logger.error(error);
      if (error.name === 'TypeError')
        throw new HttpException(error.message, 500);
      throw error;
    }
  }

  async resetpassword(payload: IResetPassword) {
    try {
      const { email, password, token, res } = payload;
      const passwordResetCountKey = `${RedisPrefix.passwordResetCount}/${email}`;
      const resetPasswordRedisKey = `${RedisPrefix.resetpassword}/${email}`;

      const userRequestReset = await this.inMemoryServices.get(
        resetPasswordRedisKey,
      );
      if (!userRequestReset)
        throw new BadRequestsException('Invalid or expired reset token');

      const user = await this.data.users.findOne({ email });
      if (!user) throw new DoesNotExistsException('user does not exists');

      // If reset link is valid and not expired
      const validReset = await compareHash(String(token), userRequestReset);
      if (!validReset)
        throw new BadRequestsException('Invalid or expired reset token');

      const hashedPassword = await hash(password);
      const twenty4H = 1 * 60 * 60 * 24;

      // Remove reset token for this user
      await this.inMemoryServices.del(resetPasswordRedisKey);
      await this.inMemoryServices.set(
        passwordResetCountKey,
        1,
        String(twenty4H),
      );

      // save reset count for next 24 hours
      // remove stored cookie so it reinstate otp
      res.cookie('deviceTag', '');
      await this.data.users.update(
        { email: user.email },
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
