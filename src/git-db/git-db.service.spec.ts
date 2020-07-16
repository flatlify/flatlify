import { Test, TestingModule } from '@nestjs/testing';
import { GitDBService } from './git-db.service';
import { ConfigService } from '@nestjs/config';

describe('GitDbService', () => {
  let service: GitDBService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GitDBService, ConfigService],
    }).compile();

    service = module.get<GitDBService>(GitDBService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
