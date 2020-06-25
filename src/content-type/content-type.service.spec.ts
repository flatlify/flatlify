import { Test, TestingModule } from '@nestjs/testing';
import { ContentTypeService } from './content-type.service';
import { GitDBService } from '../git-db/git-db.service';

describe('ContentTypeService', () => {
  let service: ContentTypeService;
  let gitDBService: GitDBService;

  const TEST_COLLECTION_NAME = 'my-collection';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContentTypeService, GitDBService],
    }).compile();

    service = module.get<ContentTypeService>(ContentTypeService);
    gitDBService = module.get<GitDBService>(GitDBService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call gitDBService list', async () => {
    jest.spyOn(gitDBService, 'list').mockImplementation(() => []);
    await service.list();
    expect(gitDBService.list).toBeCalled();
  });

  it('should call gitDBService createCollection', async () => {
    jest.spyOn(gitDBService, 'createCollection').mockImplementation(() => null);
    await service.create(TEST_COLLECTION_NAME);
    expect(gitDBService.createCollection).toBeCalledWith(TEST_COLLECTION_NAME);
  });

  it('should call gitDBService deleteCollection', async () => {
    jest.spyOn(gitDBService, 'deleteCollection').mockImplementation(() => null);
    await service.delete(TEST_COLLECTION_NAME);
    expect(gitDBService.deleteCollection).toBeCalledWith(TEST_COLLECTION_NAME);
  });
});
