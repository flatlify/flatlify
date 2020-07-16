import { Test, TestingModule } from '@nestjs/testing';
import { ContentService } from './content.service';
import { GitDBService } from '../git-db/git-db.service';
import { ContentTypeService } from '../content-type/content-type.service';

describe('ContentService', () => {
  let contentService: ContentService;
  let gitDBService: GitDBService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContentService, GitDBService, ContentTypeService],
    }).compile();

    contentService = module.get<ContentService>(ContentService);
    gitDBService = module.get<GitDBService>(GitDBService);
  });

  it('should be defined', () => {
    expect(contentService).toBeDefined();
  });

  it('should call gitDb getMany with ids', async () => {
    const testArray = [1, 2, 3];
    jest
      .spyOn(gitDBService, 'getData')
      .mockImplementation(async () => [1, 2, 3]);
    const returnedValue = await contentService.getMany('collection', {
      ids: ['1', '2', '3'],
    });

    expect(gitDBService.getData).toBeCalledWith(
      'collection',
      expect.any(Function),
    );
    expect(returnedValue).toStrictEqual(testArray);
  });

  it('should create correct filter function in getMany', async () => {
    let testResult;
    const testArray = [{ id: '1' }, { id: '3' }, { id: '4' }];
    jest
      .spyOn(gitDBService, 'getData')
      .mockImplementation(async (collectionName, func) => {
        testResult = testArray.filter(func);
        return [];
      });
    await contentService.getMany('collection', { ids: ['1', '4'] });

    expect(testResult).toStrictEqual([{ id: '1' }, { id: '4' }]);
  });

  it('should call gitDb getAll', async () => {
    const testArray = [1, 2, 3];
    jest
      .spyOn(gitDBService, 'getAll')
      .mockImplementation(async () => [1, 2, 3]);
    const returnedValue = await contentService.getMany('collection', {});

    expect(gitDBService.getAll).toBeCalledWith('collection');
    expect(returnedValue).toStrictEqual(testArray);
  });

  it('should call gitDb getOne', async () => {
    const testObject = { id: '1' };
    jest
      .spyOn(gitDBService, 'getData')
      .mockImplementation(async () => [testObject, { id: 5 }]);
    const returnedValue = await contentService.getOne('collection', '1');

    expect(gitDBService.getData).toBeCalledWith(
      'collection',
      expect.any(Function),
    );
    expect(returnedValue).toStrictEqual(testObject);
  });

  it('should create correct filter function in getOne', async () => {
    let testResult;
    const testArray = [{ id: '1' }, { id: '3' }, { id: '4' }];
    jest
      .spyOn(gitDBService, 'getData')
      .mockImplementation(async (collectionName, func) => {
        testResult = testArray.filter(func)[0];
        return [];
      });
    await contentService.getOne('collection', '3');

    expect(testResult).toStrictEqual({ id: '3' });
  });

  it('should call gitDb updateOne', async () => {
    const testObject = { id: '1' };
    const modifier = e => e;
    jest
      .spyOn(gitDBService, 'update')
      .mockImplementation(async () => [testObject]);
    const returnedValue = await contentService.update(
      'collection',
      '1',
      modifier,
    );

    expect(gitDBService.update).toBeCalledWith(
      'collection',
      expect.any(Function),
      modifier,
    );
    expect(returnedValue).toStrictEqual([testObject]);
  });

  it('should create correct filter function in updateOne', async () => {
    let testResult;
    const testArray = [{ id: '1' }, { id: '3' }, { id: '4' }];

    jest
      .spyOn(gitDBService, 'update')
      .mockImplementation(async (collectionName, func) => {
        testResult = testArray.filter(func);
        return [];
      });
    await contentService.update('collection', '4', e => e);

    expect(testResult).toStrictEqual([{ id: '4' }]);
  });

  it('should call gitDb createOne', async () => {
    const testObject = { id: '1' };
    jest
      .spyOn(gitDBService, 'insert')
      .mockImplementation(async () => testObject);
    const returnedValue = await contentService.create(
      'collection',
      testObject,
    );

    expect(gitDBService.insert).toBeCalledWith('collection', testObject);
    expect(returnedValue).toStrictEqual(testObject);
  });

  it('should call gitDb deleteOne', async () => {
    const testObject = { id: '1' };
    jest
      .spyOn(gitDBService, 'delete')
      .mockImplementation(async () => [testObject]);
    const returnedValue = await contentService.delete('collection', '1');

    expect(gitDBService.delete).toBeCalledWith(
      'collection',
      expect.any(Function),
    );
    expect(returnedValue).toStrictEqual(testObject);
  });

  it('should create correct filter function in deleteOne', async () => {
    let testResult;
    const testArray = [{ id: '1' }, { id: '3' }, { id: '4' }];
    jest
      .spyOn(gitDBService, 'delete')
      .mockImplementation(async (collectionName, func) => {
        testResult = testArray.filter(func);
        return [];
      });
    await contentService.delete('collection', '1');

    expect(testResult).toStrictEqual([{ id: '1' }]);
  });
});
