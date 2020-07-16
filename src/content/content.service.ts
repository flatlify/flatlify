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
  id?: string[];
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
      id,
    } = params;

    const data = id
      ? await this.gitDBService.getData(collectionName, document =>
          id.includes(document.id),
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

  async update(
    collectionName: string,
    id: string,
    modifier: SetCallback<any>,
  ): Promise<any> {
    const updatedDocuments = await this.gitDBService.update(
      collectionName,
      document => {
        return document.id === id;
      },
      modifier,
    );
    if (!updatedDocuments.length) {
      throw { msg: 'File not found' };
    }
    return updatedDocuments[0];
  }

  async create(
    collectionName: string,
    document: Record<string, unknown>,
  ): Promise<any> {
    return this.gitDBService.insert(collectionName, document);
  }

  async delete(collectionName: string, id: string): Promise<any> {
    const deletedDocuments = await this.gitDBService.delete(
      collectionName,
      document => document.id === id,
    );
    if (!deletedDocuments.length) {
      throw { msg: 'File not found' };
    }
    return deletedDocuments[0];
  }
}
