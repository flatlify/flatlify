import { Injectable, Inject } from '@nestjs/common';
import { GitDBService } from 'src/git-db/git-db.service';
import { SetCallback } from '@flatlify/gitdb';

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
  constructor(
    @Inject('GitDBService') private readonly gitDBService: GitDBService,
  ) {}

  async getMany(collectionName: string, params: getManyParams): Promise<any[]> {
    const {
      pagination: { page = 0, perPage = 25 },
      sort: { order = 'ASC', field = 'id' },
      ids,
    } = params;

    const start = page * perPage;
    const end = start + perPage;
    const data = ids
      ? await this.gitDBService.getData(collectionName, document =>
          ids.includes(document.id),
        )
      : await this.gitDBService.getAll(collectionName);

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
    return this.gitDBService.getData(collectionName, e => e.id === id);
  }

  updateMany(
    collectionName: string,
    ids: string[],
    modifier: SetCallback<any>,
  ): Promise<any> {
    return this.gitDBService.update(
      collectionName,
      document => ids.includes(document.id),
      modifier,
    );
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
    return this.gitDBService.delete(
      collectionName,
      document => document.id === id,
    );
  }

  async deleteMany(collectionName: string, ids: string[]): Promise<any[]> {
    return this.gitDBService.delete(collectionName, document =>
      ids.includes(document.id),
    );
  }
}
