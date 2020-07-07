import { Test, TestingModule } from '@nestjs/testing';
import { ContentTypeController } from './content-type.controller';
import { ContentTypeService } from './content-type.service';
import { GitDBService } from '../git-db/git-db.service';

describe('ContentType Controller', () => {
  let controller: ContentTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContentTypeController],
      providers: [ContentTypeService, GitDBService],
    }).compile();

    controller = module.get<ContentTypeController>(ContentTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
