
import { Global, Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';
import { IInMemoryServices } from 'src/core/abstracts/in-memory.abstract';
import { CustomRedisService } from './redis-service.service';
import config from "./redis-config"


@Global()
@Module({
  imports: [
    RedisModule.forRoot({
      config: config
    }),
  ],

  providers: [
    {
      provide: IInMemoryServices,
      useClass: CustomRedisService,
    },
  ],
  exports: [IInMemoryServices],
})

export class RedisServiceModule {}