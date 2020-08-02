import { Injectable, Inject } from '@nestjs/common';
import { GitDB, Filter, SetCallback } from '@flatlify/gitdb'; //'../../../gitdb/src/index'; //
import { ConfigService } from '@nestjs/config';
import { CollectionNotFound } from '../exceptions';

@Injectable()
export class GitDBService {
  private gitdb: GitDB;
  constructor(
    @Inject('ConfigService') private readonly configService: ConfigService,
  ) {
    const autoCommit = configService.get('AUTO_COMMIT') === 'true';
    const cache = configService.get('CACHE') === 'true';
    const dbDir = configService.get('DB_DIR');

    const config = {
      autoCommit,
      cache,
      dbDir,
    };
    this.gitdb = new GitDB(config);
    this.gitdb.init();
  }

  public list(): string[] {
    return this.gitdb.list();
  }

  public async init(): Promise<void> {
    return this.gitdb.init();
  }

  public async createCollection(collectionName: string): Promise<string> {
    const collection = await this.gitdb.createCollection(collectionName);
    return collection;
  }

  public async deleteCollection(collectionName: string): Promise<string> {
    if (this.getCollection(collectionName)) {
      return this.gitdb.delete(collectionName);
    }
  }

  public async getAll(collectionName: string): Promise<any[]> {
    const collection = await this.getCollection(collectionName);

    return collection.getAll();
  }

  public async getData(
    collectionName: string,
    callback: (any) => boolean,
  ): Promise<any[]> {
    return this.getCollection(collectionName).getData(callback);
  }

  public async insert(
    collectionName: string,
    documentData: Record<string, unknown>,
  ): Promise<any> {
    return this.getCollection(collectionName).insert(documentData);
  }

  public async update(
    collectionName: string,
    filter: Filter<any>,
    modifier: SetCallback<any, any>,
  ): Promise<any[]> {
    return this.getCollection(collectionName).update(filter, modifier);
  }

  public async delete(
    collectionName: string,
    filter: Filter<any>,
  ): Promise<any[]> {
    return this.getCollection(collectionName).delete(filter);
  }

  private getCollection(collectionName) {
    const collection = this.gitdb.get(collectionName);
    if (!collection) {
      throw new CollectionNotFound();
    }
    return collection;
  }
}
