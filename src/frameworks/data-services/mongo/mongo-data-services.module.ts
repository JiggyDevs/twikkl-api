import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MONGO_DB_URL } from 'src/config';
import { IDataServices } from 'src/core/abstracts';

import { MongoDataServices } from './mongo-data-services.service';
import { SCHEMA_LIST } from './schema-lists';

@Module({
  imports: [
    MongooseModule.forFeature(SCHEMA_LIST),
    MongooseModule.forRoot(MONGO_DB_URL),
  ],
  providers: [
    {
      provide: IDataServices,
      useClass: MongoDataServices,
    },
  ],
  exports: [IDataServices],
})
export class MongoDataServicesModule { }