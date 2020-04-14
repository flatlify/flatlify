const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fse = require('fs-extra');
const findGitRoot = require('find-git-root');
const contentRouter = require('./contentRouter');
const contentTypesRouter = require('./contentTypesRouter');

require('dotenv').config();

async function server({ publicBaseUrl, dbDir }) {
  const app = express();
  const DEFAULT_PORT = 3020;
  const port = parseInt(process.env.PORT, 10) || DEFAULT_PORT;

  const gitRepositoryRoot = path.resolve(findGitRoot(dbDir), '..');

  app.use(bodyParser.json()); // support json encoded bodies
  app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
  app.use(cors());

  await Promise.all([
    fse.ensureDir(path.resolve(dbDir, 'content')),
    fse.ensureDir(path.resolve(dbDir, 'public')),
    fse.ensureDir(path.resolve(dbDir, 'content-types')),
  ]);

  app.use('/content-types', contentTypesRouter(dbDir, gitRepositoryRoot));

  const contentRoot = path.resolve(dbDir, 'content');
  app.use('/content', contentRouter(contentRoot, gitRepositoryRoot));
  app.use('/public', express.static(path.resolve(dbDir, 'public')));

  app.listen(port, err => {
    console.info(`Server is running on: http://localhost:${port}`);
    if (err) {
      throw err;
    }
  });
  return app;
}

module.exports = server;
