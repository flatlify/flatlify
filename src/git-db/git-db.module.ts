import { Module } from '@nestjs/common';
import { GitDBService } from './git-db.service';

@Module({
  providers: [GitDBService],
  exports: [GitDBService],
})
export class GitDBModule {}
