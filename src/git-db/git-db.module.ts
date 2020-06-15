import { Module } from '@nestjs/common';
import GitDB from '../../../gitdb/src/gitdb';
import path from 'path';

@Module({})
export class GitDbModule {
  private gitdb: GitDB;
  constructor() {
    this.gitdb = await GitDB.init({
      autoCommit: false,
      cache: false,
      dbDir: path.join(__dirname, 'database'),
    });
  }
}
