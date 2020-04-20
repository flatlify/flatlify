const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const fse = require("fs-extra");
const findGitRoot = require("find-git-root");
const contentRouter = require("./contentRouter");
const contentTypesRouter = require("./contentTypesRouter");

const DEFAULT_PORT = 3020;
async function server({
  port = DEFAULT_PORT,
  publicBaseUrl = "public",
  dbDir,
}) {
  const app = express();

  const gitRepositoryRoot = path.resolve(findGitRoot(dbDir), "..");

  app.use(bodyParser.json()); // support json encoded bodies
  app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
  app.use(cors());

  await Promise.all([
    fse.ensureDir(path.resolve(dbDir, "content")),
    fse.ensureDir(path.resolve(dbDir, publicBaseUrl)),
    fse.ensureDir(path.resolve(dbDir, "content-types")),
  ]);

  app.use(
    "/content-types",
    contentTypesRouter(dbDir, gitRepositoryRoot, publicBaseUrl),
  );

  const contentRoot = path.resolve(dbDir, "content");
  app.use(
    "/content",
    contentRouter(contentRoot, gitRepositoryRoot, publicBaseUrl),
  );
  app.use(
    `/${publicBaseUrl}`,
    express.static(path.resolve(dbDir, publicBaseUrl)),
  );

  app.listen(port, (err) => {
    console.info(`Server is running on: http://localhost:${port}`);
    if (err) {
      throw err;
    }
  });
  return app;
}

module.exports = server;
