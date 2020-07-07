import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ContentTypeModule } from './content-type.module';

describe('Cats', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ContentTypeModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`can create collection`, () => {
    request(app.getHttpServer())
      .post('/content-type/collections/new-content-type')
      .send({})
      .expect(201);
  });

  it(`can delete created collection`, async () => {
    await request(app.getHttpServer())
      .post('/content-type/collections/new-content-type')
      .send({});

    await request(app.getHttpServer())
      .delete('/content-type/collections/new-content-type')
      .send({})
      .expect(200);
  });

  it(`list works properly`, async () => {
    await request(app.getHttpServer())
      .post('/content-type/collections/new-content-type-one')
      .send({});

    await request(app.getHttpServer())
      .post('/content-type/collections/new-content-type-two')
      .send({});

    await request(app.getHttpServer())
      .get('/content-type/collections')
      .expect(200)
      .expect(['new-content-type-one', 'new-content-type-two']);
  });

  afterAll(async () => {
    await app.close();
  });
});
