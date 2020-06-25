import { Injectable, Inject } from '@nestjs/common';
import { GitDBService } from '../git-db/git-db.service';

@Injectable()
export class ContentTypeService {
  constructor(
    @Inject('GitDBService') private readonly gitDBService: GitDBService,
  ) {}

  async list(): Promise<any[]> {
    return this.gitDBService.list();
  }

  async create(collectionName: string): Promise<any> {
    return this.gitDBService.createCollection(collectionName);
  }

  async delete(collectionName: string): Promise<any> {
    return this.gitDBService.deleteCollection(collectionName);
  }
}
