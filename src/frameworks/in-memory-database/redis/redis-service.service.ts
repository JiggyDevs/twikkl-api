import { Injectable, Logger } from "@nestjs/common";
import { IInMemoryServices } from "src/core/abstracts/in-memory.abstract";

import { InjectRedis, Redis } from '@nestjs-modules/ioredis';

@Injectable()
export class CustomRedisService implements IInMemoryServices {


  constructor(
    @InjectRedis() private readonly redis: Redis,
  ) { }

  async set(key: string, value: any, expiry: string | any[]) {
    try {
      await this.redis.set(key, value, 'EX', expiry);
    } catch (e) {
      Logger.error('@cache-manager-redis', e)
    }

  }
  async get(key: string) {
    try {
      const value = await this.redis.get(key)
      return value;
    } catch (e) {
      Logger.error('@cache-manager-redis', e)
    }
  }

  async del(key: string) {
    try {
      await this.redis.del(key);
    } catch (e) {
      Logger.error('@cache-manager-redis', e)
    }
  }

  async ttl(key: string) {
    try {
      const value = await this.redis.ttl(key);
      return value;

    } catch (e) {
      Logger.error('@cache-manager-redis', e)
    }
  }
}
