import { Global, Module } from '@nestjs/common';
import { IHttpServices } from 'src/core/abstracts/http-services.abstract';
import { AxiosService } from './axios.service';

@Global()
@Module({
  providers: [
    {
      provide: IHttpServices,
      useClass: AxiosService,
    },
  ],
  exports: [IHttpServices],
})
export class AxiosServiceModule {}
