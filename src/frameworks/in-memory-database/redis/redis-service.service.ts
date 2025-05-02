import { Injectable, Logger } from '@nestjs/common';
import { IInMemoryServices } from 'src/core/abstracts/in-memory.abstract';

// 1️⃣ Bring in the NestJS decorator only:
import { InjectRedis } from '@nestjs-modules/ioredis';

// import { InjectRedis, Redis } from '@nestjs-modules/ioredis';

// 2️⃣ Import the actual Redis client type from the ioredis package:
import Redis from 'ioredis';

@Injectable()
export class CustomRedisService implements IInMemoryServices {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  // async set(key: string, value: any, expiry: string | any[]) {
  //   try {
  //     await this.redis.set(key, value, 'EX', expiry);
  //   } catch (e) {
  //     Logger.error('@cache-manager-redis', e);
  //   }
  // }

  async set(key: string, value: any, expiry: string) {
    try {
      await this.redis.set(key, value);
      await this.redis.expire(key, expiry);
    } catch (e) {
      Logger.error('@cache-manager-redis', e);
    }
  }

  async get(key: string) {
    try {
      const value = await this.redis.get(key);
      return value;
    } catch (e) {
      Logger.error('@cache-manager-redis', e);
    }
  }

  async del(key: string) {
    try {
      await this.redis.del(key);
    } catch (e) {
      Logger.error('@cache-manager-redis', e);
    }
  }

  async ttl(key: string) {
    try {
      const value = await this.redis.ttl(key);
      return value;
    } catch (e) {
      Logger.error('@cache-manager-redis', e);
    }
  }
}
