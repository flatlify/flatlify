import { Module } from '@nestjs/common';
import { GitDBService } from './git-db.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [GitDBService],
  exports: [GitDBService],
  imports: [ConfigModule],
})
export class GitDBModule {}
