import { Injectable, Inject } from '@nestjs/common';
import { GitDB, SetCallback } from 'gitdb';

interface getManyParams {
  pagination?: {
    perPage?: number;
    page?: number;
  };
  sort?: {
    order?: string;
    field?: string;
  };
  ids: string[];
}

@Injectable()
export class ContentService {
  constructor(@Inject('GitDB') private readonly gitDB: GitDB) {}

  async getMany(collectionName: string, params: getManyParams): Promise<any[]> {
    const {
      pagination: { page = 0, perPage = 25 },
      sort: { order = 'ASC', field = 'id' },
      ids,
    } = params;

    const start = page * perPage;
    const end = start + perPage;
    const collection = await this.gitDB.get(collectionName);
    const data = ids
      ? await collection.getData(document => ids.includes(document.id))
      : await collection.getAll();

    return data.slice(start, end).sort((a, b) => {
      if (a[field] < b[field]) {
      }
      if (a[field] > b[field]) {
        return 1;
      }
      return 0;
    });
  }

  async getOne(collectionName: string, id: string): Promise<any> {
    return this.gitDB.get(collectionName).getData(e => e.id === id);
  }

  updateMany(
    collectionName: string,
    ids: string[],
    modifier: SetCallback<any>,
  ): Promise<any> {
    return this.gitDB
      .get(collectionName)
      .update(document => ids.includes(document.id), modifier);
  }

  async updateOne(
    collectionName: string,
    id: string,
    modifier: SetCallback<any>,
  ): Promise<any> {
    return this.gitDB
      .get(collectionName)
      .update(document => document.id === id, modifier);
  }

  async createOne(collectionName: string, document: any): Promise<any> {
    return this.gitDB.get(collectionName).insert(document);
  }

  async deleteOne(collectionName: string, id: string): Promise<any> {
    return this.gitDB
      .get(collectionName)
      .delete(document => document.id === id);
  }

  async deleteMany(collectionName: string, ids: string[]): Promise<any[]> {
    return this.gitDB
      .get(collectionName)
      .delete(document => ids.includes(document.id));
  }
}
