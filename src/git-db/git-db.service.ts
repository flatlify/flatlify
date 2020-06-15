import { Injectable } from '@nestjs/common';
import GitDB from '../../../gitdb/src/gitdb';
import path from 'path';
import { Filter, SetCallback } from '../../../gitdb/src/collectionStrategy';

@Injectable()
export class GitDbService {
  private gitdb: GitDB;
  constructor() {
    this.gitdb = new GitDB({
      autoCommit: false,
      cache: false,
      dbDir: path.join(__dirname, 'database'),
    });
  }
  public async init(): Promise<void> {
    await this.gitdb.init();
  }

  public async createCollection(collectionName: string): Promise<void> {
    await this.gitdb.createCollection(collectionName);
  }

  public async getAll(collectionName: string): Promise<any[]> {
    return this.gitdb.get(collectionName).getAll();
  }

  public async getData(
    collectionName: string,
    callback: (any) => boolean,
  ): Promise<any[]> {
    return this.gitdb.get(collectionName).getData(callback);
  }

  public async insert(collectionName: string, documentData: any): Promise<any> {
    return this.gitdb.get(collectionName).insert(documentData);
  }

  public async update(
    collectionName: string,
    filter: Filter<any>,
    modifier: SetCallback<any>,
  ): Promise<any[]> {
    return this.gitdb.get(collectionName).update(filter, modifier);
  }

  public async delete(
    collectionName: string,
    filter: Filter<any>,
  ): Promise<any[]> {
    return this.gitdb.get(collectionName).delete(filter);
  }
}
