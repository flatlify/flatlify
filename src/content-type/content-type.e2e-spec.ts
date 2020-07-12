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

  afterAll(async () => {
    await app.close();
  });

  it(`can create and delete collection`, async () => {
    await request(app.getHttpServer())
      .post('/content-type/collections/new-content-type')
      .expect(201);

    await request(app.getHttpServer())
      .delete('/content-type/collections/new-content-type')
      .expect(200);
  });

  it(`should fail if attempted to create collection which already exists`, async () => {
    try {
      await request(app.getHttpServer()).post(
        '/content-type/collections/new-content-type',
      );

      await request(app.getHttpServer())
        .post('/content-type/collections/new-content-type')
        .expect(409);
    } finally {
      await request(app.getHttpServer()).delete(
        '/content-type/collections/new-content-type',
      );
    }
  });

  it(`should fail if attempted to delete non existing collection`, async () => {
    await request(app.getHttpServer())
      .delete('/content-type/collections/new-content-type')
      .expect(404);
  });

  it(`list works properly`, async () => {
    await request(app.getHttpServer()).post(
      '/content-type/collections/new-content-type-one',
    );

    await request(app.getHttpServer()).post(
      '/content-type/collections/new-content-type-two',
    );

    await request(app.getHttpServer())
      .get('/content-type/collections')
      .expect(200)
      .expect(['new-content-type-one', 'new-content-type-two']);
  });

  it(`list works properly`, async () => {
    await request(app.getHttpServer()).post(
      '/content-type/collections/new-content-type-one',
    );

    await request(app.getHttpServer()).post(
      '/content-type/collections/new-content-type-two',
    );

    await request(app.getHttpServer())
      .get('/content-type/collections')
      .expect(200)
      .expect(['new-content-type-one', 'new-content-type-two']);
  });
});
