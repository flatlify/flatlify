import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ContentTypeModule } from './content-type.module';
import { ContentTypeService } from './content-type.service';

describe('Cats', () => {
  let app: INestApplication;
  const contentTypeService = { findAll: () => ['test'] };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ContentTypeModule],
    })
      .overrideProvider(ContentTypeService)
      .useValue(contentTypeService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET cats`, () => {
    return request(app.getHttpServer())
      .get('/cats')
      .expect(200)
      .expect({
        data: contentTypeService.findAll(),
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
