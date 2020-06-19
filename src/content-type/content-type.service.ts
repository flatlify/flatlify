import { Injectable, Inject } from '@nestjs/common';
import { GitDB } from 'gitdb';

@Injectable()
export class ContentTypeService {
  constructor(@Inject('GitDB') private readonly gitDB: GitDB) {}

  async getList(): Promise<any[]> {
    return this.gitDB.list();
  }

  async create(collectionName: string): Promise<any> {
    return this.gitDB.createCollection(collectionName);
  }

  async delete(collectionName: string): Promise<any> {
    return this.gitDB.delete(collectionName);
  }
}
