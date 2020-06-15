import { Module } from '@nestjs/common';
import { GitDbService } from './git-db.service';

@Module({ imports: [GitDbModule], exports: [GitDbService] })
export class GitDbModule {}
