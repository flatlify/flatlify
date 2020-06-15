import { Test, TestingModule } from '@nestjs/testing';
import { ContentTypeController } from './content-type.controller';

describe('ContentType Controller', () => {
  let controller: ContentTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContentTypeController],
    }).compile();

    controller = module.get<ContentTypeController>(ContentTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
