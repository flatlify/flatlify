import * as request from 'supertest';
import * as dotenv from 'dotenv';
import * as fse from 'fs-extra';

dotenv.config();
const { DB_DIR, PORT } = process.env;
process.env.DB_DIR = `${__dirname}/database`;
const URL = `localhost:${PORT}`;

describe('Content type', () => {
  beforeAll(async () => {
    await fse.ensureDir(DB_DIR);
  });

  afterAll(async () => {
    await fse.remove(DB_DIR);
  });

  it(`can create and delete collection`, async () => {
    await request(URL)
      .post('/content-type/collections/new-content-type')
      .expect(201);

    await request(URL)
      .delete('/content-type/collections/new-content-type')
      .expect(200);
  });

  it(`should fail if attempted to create collection which already exists`, async () => {
    try {
      await request(URL).post('/content-type/collections/new-content-type');

      await request(URL)
        .post('/content-type/collections/new-content-type')
        .expect(409);
    } finally {
      await request(URL).delete('/content-type/collections/new-content-type');
    }
  });

  it(`should fail if attempted to delete non existing collection`, async () => {
    await request(URL)
      .delete('/content-type/collections/new-content-type')
      .expect(404);
  });

  it(`list works properly`, async () => {
    await request(URL).post('/content-type/collections/new-content-type-one');

    await request(URL).post('/content-type/collections/new-content-type-two');

    await request(URL)
      .get('/content-type/collections')
      .expect(200)
      .expect(['new-content-type-one', 'new-content-type-two']);
  });

  it(`list works properly`, async () => {
    await request(URL).post('/content-type/collections/new-content-type-one');

    await request(URL).post('/content-type/collections/new-content-type-two');

    await request(URL)
      .get('/content-type/collections')
      .expect(200)
      .expect(['new-content-type-one', 'new-content-type-two']);
  });
});
