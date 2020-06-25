import { Injectable } from '@nestjs/common';
import { GitDB, Filter, SetCallback } from '@flatlify/gitdb';
import * as path from 'path';

@Injectable()
export class GitDBService {
  private gitdb: GitDB;
  constructor() {
    const config = {
      autoCommit: false,
      cache: false,
      dbDir: path.resolve(__dirname, 'database'),
    };
    this.gitdb = new GitDB(config);
  }

  public list(): string[] {
    return this.gitdb.list();
  }

  public async init(): Promise<void> {
    return this.gitdb.init();
  }

  public async createCollection(collectionName: string): Promise<string> {
    return this.gitdb.createCollection(collectionName);
  }

  public async deleteCollection(collectionName: string): Promise<string> {
    return this.gitdb.delete(collectionName);
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
