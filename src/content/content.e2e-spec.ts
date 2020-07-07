import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ContentModule } from './content.module';
import { ContentTypeModule } from '../content-type/content-type.module';

describe('Cats', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ContentTypeModule, ContentModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`can create document inside collection`, async () => {
    await request(app.getHttpServer())
      .post('/content-type/collections/new-content-type')
      .send({});

    await request(app.getHttpServer())
      .post('/content/collections/new-content-type')
      .send({ info: 'info' })
      .expect(201)
      .expect({ info: 'info' });
  });

  afterAll(async () => {
    await app.close();
  });
});
