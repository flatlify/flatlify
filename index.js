const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const fse = require("fs-extra");
const contentRouter = require("./contentRouter");
const contentTypesRouter = require("./contentTypesRouter");

require("dotenv").config();
async function server(root, gitRepositoryRoot) {
  const app = express();
  const DEFAULT_PORT = 3020;
  const port = parseInt(process.env.PORT, 10) || DEFAULT_PORT;

  app.use(bodyParser.json()); // support json encoded bodies
  app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
  app.use(cors());

  await Promise.all([
    fse.ensureDir(path.resolve(root, "db")),
    fse.ensureDir(path.resolve(root, "db/content")),
    fse.ensureDir(path.resolve(root, "db/public")),
    fse.ensureDir(path.resolve(root, "db/content-types")),
  ]);

  const contentTypesRoot = path.resolve(root, "db");

  app.use(
    "/content-types",
    contentTypesRouter(contentTypesRoot, gitRepositoryRoot),
  );
  const contentRoot = path.resolve(root, "db/content");
  app.use("/content", contentRouter(contentRoot, gitRepositoryRoot));
  app.use("/public", express.static(path.resolve(root, "db/public")));

  app.listen(port, (err) => {
    console.info(`Server is running on: http://localhost:${port}`);
    if (err) {
      throw err;
    }
  });
  return app;
}

module.exports = server;

