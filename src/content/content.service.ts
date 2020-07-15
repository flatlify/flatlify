import { Injectable, Inject } from '@nestjs/common';
import { GitDBService } from '../git-db/git-db.service';
import { SetCallback } from '@flatlify/gitdb';

interface getManyParams {
  pagination?: {
    start?: number;
    limit?: number;
  };
  sort?: {
    order?: string;
    field?: string;
  };
  ids?: string[];
}

@Injectable()
export class ContentService {
  constructor(
    @Inject('GitDBService') private readonly gitDBService: GitDBService,
  ) {}

  async getMany(collectionName: string, params: getManyParams): Promise<any[]> {
    const {
      pagination: { start = 0, limit = 25 } = {},
      sort: { order = 'ASC', field = 'id' } = {},
      ids,
    } = params;

    const data = ids
      ? await this.gitDBService.getData(collectionName, document =>
          ids.includes(document.id),
        )
      : await this.gitDBService.getAll(collectionName);

    return data.slice(start, start + limit).sort((a, b) => {
      if (a[field] < b[field]) {
      }
      if (a[field] > b[field]) {
        return 1;
      }
      return 0;
    });
  }

  async getOne(collectionName: string, id: string): Promise<any> {
    const result = await this.gitDBService.getData(
      collectionName,
      e => e.id === id,
    );
    return result[0];
  }

  async updateOne(
    collectionName: string,
    id: string,
    modifier: SetCallback<any>,
  ): Promise<any> {
    return this.gitDBService.update(
      collectionName,
      document => document.id === id,
      modifier,
    );
  }

  async createOne(collectionName: string, document: any): Promise<any> {
    return this.gitDBService.insert(collectionName, document);
  }

  async deleteOne(collectionName: string, id: string): Promise<any> {
    const result = await this.gitDBService.delete(
      collectionName,
      document => document.id === id,
    );
    return result[0];
  }
}
