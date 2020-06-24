import { Test, TestingModule } from '@nestjs/testing';
import { GitDBService } from './git-db.service';

describe('GitDbService', () => {
  let service: GitDBService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GitDBService],
    }).compile();

    service = module.get<GitDBService>(GitDBService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
