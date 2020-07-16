import * as request from 'supertest';
import * as dotenv from 'dotenv';
import { equal } from 'assert';
import * as fse from 'fs-extra';

dotenv.config();
const { DB_DIR, PORT } = process.env;
process.env.DB_DIR = `${__dirname}/database`;
const URL = `localhost:${PORT}`;

describe('Content', () => {
  beforeAll(async () => {
    await fse.ensureDir(DB_DIR);
    await request(URL)
      .post('/content-type/collections/test-content-type')
      .send({});
  });

  afterAll(async () => {
    await request(URL)
      .delete('/content-type/collections/test-content-type')
      .send({});
    await fse.remove(DB_DIR);
  });

  it(`can create document inside collection`, async () => {
    await request(URL)
      .post('/content/collections/test-content-type')
      .send({ info: 'info' })
      .expect(201)
      .expect(res => equal(res.info, 'info'));
  });

  it(`can create and delete document inside collection`, async () => {
    const data = await request(URL)
      .post('/content/collections/test-content-type')
      .send({ info: 'info' })
      .expect(201);

    await request(URL)
      .delete(`/content/collections/test-content-type/${data.body.id}`)
      .expect(200);
  });

  it(`cannot delete non existing document`, async () => {
    await request(URL)
      .delete(`/content/collections/test-content-type/random-id`)
      .expect(404);
  });

  it(`can get multiple documents`, async () => {
    const documentOne = await request(URL)
      .post('/content/collections/test-content-type')
      .send({ info: 'info one' });

    const documentTwo = await request(URL)
      .post('/content/collections/test-content-type')
      .send({ info: 'info two' });

    await request(URL)
      .get(`/content/collections/test-content-type`)
      .query({ ids: [documentOne.body.id, documentTwo.body.id] })
      .expect(
        res =>
          res.body[0].info === 'info one' && res.body[1].info === 'info two',
      );
  });

  it(`can get one document`, async () => {
    const document = await request(URL)
      .post('/content/collections/test-content-type')
      .send({ info: 'info' });

    await request(URL)
      .get(`/content/collections/test-content-type/${document.body.id}`)
      .expect(res => res.body.info === 'info');
  });

  it(`cannot get non existing document`, async () => {
    await request(URL)
      .get(`/content/collections/test-content-type/random-id`)
      .expect(404);
  });

  it(`can update document`, async () => {
    const document = await request(URL)
      .post('/content/collections/test-content-type')
      .send({ info: 'info' });

    await request(URL)
      .put(`/content/collections/test-content-type/${document.body.id}`)
      .send({ info: 'new info', newField: 'newField' })
      .expect(200);

    await request(URL)
      .get(`/content/collections/test-content-type/${document.body.id}`)
      .expect({ id: document.body.id, info: 'new info', newField: 'newField' });
  });

  it(`can't update id`, async () => {
    const document = await request(URL)
      .post('/content/collections/test-content-type')
      .send({ info: 'info' });

    await request(URL)
      .put(`/content/collections/test-content-type/${document.body.id}`)
      .send({ id: '1232135', info: 'new info', newField: 'newField' })
      .expect(200);

    await request(URL)
      .get(`/content/collections/test-content-type/${document.body.id}`)
      .expect({ id: document.body.id, info: 'new info', newField: 'newField' });
  });
});
