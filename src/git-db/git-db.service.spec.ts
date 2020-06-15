import { Test, TestingModule } from '@nestjs/testing';
import { GitDbService } from './git-db.service';

describe('GitDbService', () => {
  let service: GitDbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GitDbService],
    }).compile();

    service = module.get<GitDbService>(GitDbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
