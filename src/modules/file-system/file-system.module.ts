import { Module } from '@nestjs/common';
import {HttpModule} from "@nestjs/axios"
import { FileSystemService } from './file-system.service';

@Module({
  imports: [HttpModule],
  providers: [FileSystemService],
  exports: [FileSystemService]
})
export class FileSystemModule {}
