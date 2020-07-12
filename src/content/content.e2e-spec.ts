import * as request from 'supertest';
import { exec } from 'child_process';
import { equal } from 'assert';
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
    await request(app.getHttpServer()).post(
      '/content-type/collections/test-content-type',
    );
  });

  afterAll(async () => {
    await app.close();
    // TODO: use env variables for this
    // const dbFolder = ?
    // exec(`rm -rf ${dbFolder}`)
  });

  it(`can create document inside collection`, async () => {
    await request(app.getHttpServer())
      .post('/content/collections/test-content-type')
      .send({ info: 'info' })
      .expect(201)
      .expect(res => equal(res.info, 'info'));
  });

  it(`can create and delete document inside collection`, async () => {
    await request(app.getHttpServer())
      .post('/content-type/collections/test-content-type')
      .send({});

    const data = await request(app.getHttpServer())
      .post('/content/collections/test-content-type')
      .send({ info: 'info' })
      .expect(201);

    await request(app.getHttpServer())
      .delete(`/content/collections/test-content-type/${data.body.id}`)
      .expect(200);
  });

  it(`cannot delete non existing document`, async () => {
    await request(app.getHttpServer())
      .delete(`/content/collections/test-content-type/random-id`)
      .expect(404);
  });

  it(`can delete multiple documents`, async () => {
    const documentOne = await request(app.getHttpServer()).post(
      '/content/collections/test-content-type',
    );

    const documentTwo = await request(app.getHttpServer()).post(
      '/content/collections/test-content-type',
    );

    await request(app.getHttpServer())
      .delete(`/content/collections/test-content-type`)
      .send({ ids: [documentOne, documentTwo] })
      .expect(200);
  });

  it(`cannot delete non existing documents`, async () => {
    await request(app.getHttpServer())
      .delete(`/content/collections/test-content-type`)
      .send({ ids: ['random id', 'random id 2'] })
      .expect(404);
  });

  it(`can get multiple documents`, async () => {
    const documentOne = await request(app.getHttpServer())
      .post('/content/collections/test-content-type')
      .send({ info: 'info one' });

    const documentTwo = await request(app.getHttpServer())
      .post('/content/collections/test-content-type')
      .send({ info: 'info two' });

    await request(app.getHttpServer())
      .get(`/content/collections/test-content-type`)
      .query({ ids: [documentOne.body.id, documentTwo.body.id] })
      .expect(
        res =>
          res.body[0].info === 'info one' && res.body[1].info === 'info two',
      );
  });

  it(`can get one document`, async () => {
    const document = await request(app.getHttpServer())
      .post('/content/collections/test-content-type')
      .send({ info: 'info' });

    await request(app.getHttpServer())
      .get(`/content/collections/test-content-type/${document.body.id}`)
      .expect(res => res.body.info === 'info');
  });

  it(`cannot get non existing document`, async () => {
    await request(app.getHttpServer())
      .get(`/content/collections/test-content-type/random-id`)
      .expect(404);
  });

  it(`handle mix of existing & non existing documents`, async () => {
    const document = await request(app.getHttpServer())
      .post('/content/collections/test-content-type')
      .send({ info: 'info' });

    // ? what data or code should server return
    await request(app.getHttpServer())
      .get(`/content/collections/test-content-type`)
      .query({ ids: [document.body.id, 'random-id'] })
      .expect(404);
  });

  it(`can update document`, async () => {
    const document = await request(app.getHttpServer())
      .post('/content/collections/test-content-type')
      .send({ info: 'info' });

    await request(app.getHttpServer())
      .put(`/content/collections/test-content-type/${document.body.id}`)
      .send({ info: 'new info', newField: 'newField' })
      .expect(200);

    await request(app.getHttpServer())
      .get(`/content/collections/test-content-type/${document.body.id}`)
      .expect({ id: document.body.id, info: 'new info', newField: 'newField' });
  });

  it(`can't update id`, async () => {
    const document = await request(app.getHttpServer())
      .post('/content/collections/test-content-type')
      .send({ info: 'info' });

    await request(app.getHttpServer())
      .put(`/content/collections/test-content-type/${document.body.id}`)
      .send({ id: '1232135', info: 'new info', newField: 'newField' })
      .expect(200);

    await request(app.getHttpServer())
      .get(`/content/collections/test-content-type/${document.body.id}`)
      .expect({ id: document.body.id, info: 'new info', newField: 'newField' });
  });

  it(`can update multiple documents`, async () => {
    const documentOne = await request(app.getHttpServer())
      .post('/content/collections/test-content-type')
      .send({ info: 'info' });

    const documentTwo = await request(app.getHttpServer())
      .post('/content/collections/test-content-type')
      .send({ info: 'info' });

    const documentOneId = documentOne.body.id;
    const documentTwoId = documentTwo.body.id;

    await request(app.getHttpServer())
      .put(`/content/collections/test-content-type`)
      .send({
        ids: [documentOneId, documentTwoId],
        data: { info: 'new info', newField: 'newField' },
      })
      .expect(200);

    await request(app.getHttpServer())
      .get(`/content/collections/test-content-type`)
      .query({ ids: [documentOneId, documentTwoId] })
      .expect([
        { id: documentOneId, info: 'new info', newField: 'newField' },
        { id: documentTwoId, info: 'new info', newField: 'newField' },
      ]);
  });
});
