import { Test, TestingModule } from '@nestjs/testing';
import { ContentService } from './content.service';
import { GitDBService } from '../git-db/git-db.service';

describe('ContentService', () => {
  let service: ContentService;
  let gitDBService: GitDBService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContentService, GitDBService],
    }).compile();

    service = module.get<ContentService>(ContentService);
    gitDBService = module.get<GitDBService>(GitDBService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call gitDBService getMany', async () => {
    jest.spyOn(gitDBService, 'list').mockImplementation(() => []);  
    await service.getMany();
    expect(gitDBService.getMany).toBeCalled();
  });

  it('should call gitDBService getOne', async () => {
    jest.spyOn(gitDBService, 'list').mockImplementation(() => []);
    await service.getOne();
    expect(gitDBService.getOne).toBeCalled();
  });

  it('should call gitDBService updateMany', async () => {
    jest.spyOn(gitDBService, 'updateMany').mockImplementation(() => []);
    await service.updateMany();
    expect(gitDBService.updateMany).toBeCalled();
  });

  it('should call gitDBService updateOne', async () => {
    jest.spyOn(gitDBService, 'updateOne').mockImplementation(() => []);
    await service.updateOne();
    expect(gitDBService.updateOne).toBeCalled();
  });

  it('should call gitDBService createOne', async () => {
    jest.spyOn(gitDBService, 'createOne').mockImplementation(() => []);
    await service.createOne();
    expect(gitDBService.createOne).toBeCalled();
  });

  it('should call gitDBService deleteOne', async () => {
    jest.spyOn(gitDBService, 'deleteOne').mockImplementation(() => []);
    await service.deleteOne();
    expect(gitDBService.deleteOne).toBeCalled();
  });

  it('should call gitDBService deleteMany', async () => {
    jest.spyOn(gitDBService, 'deleteMany').mockImplementation(() => []);
    await service.deleteMany();
    expect(gitDBService.deleteMany).toBeCalled();
  });
});
