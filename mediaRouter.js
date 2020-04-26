const express = require("express");
const { orderBy, slice } = require("lodash");
const { v4: uuidv4 } = require("uuid");
const utils = require("./utils/common");
const gitUtils = require("./git-utils");
const media = require("./utils/media");

module.exports = (dbDir, repositoryRoot, publicBaseUrl) => {
  const { upload, extractFilesMeta, fileFieldsAppendSrc } = media(
    dbDir,
    publicBaseUrl,
  );
  const uploadMiddleware = upload.any();

  const router = express.Router();

  router.get("/", async (req, res) => {
    const pagination =
      req.query && req.query.pagination ? JSON.parse(req.query.pagination) : {};
    const sort = req.query && req.query.sort ? JSON.parse(req.query.sort) : {};

    const _start = (pagination.page - 1) * pagination.perPage || 0;
    const _end = pagination.page * pagination.perPage || 25;
    const _order = sort.order || "ASC";
    const _sort = sort.field || "id";

    const mediaPath = `${dbDir}/content/media`;
    const filesInfo = await utils.readCollectionList(mediaPath);
    const items = slice(orderBy(filesInfo, [_sort], [_order]), _start, _end);

    res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");
    res.setHeader("X-Total-Count", items.length);
    res.send({
      data: items,
      total: filesInfo.length,
    });
  });

  router.get("/:itemId", async (req, res) => {
    const { itemId } = req.params;

    const mediaPath = `${dbDir}/content/media/${itemId}.json`;
    const [data] = fileFieldsAppendSrc([await utils.read(mediaPath)]);
    res.send({ data });
  });

  router.post("/", uploadMiddleware, async (req, res) => {
    const newId = uuidv4();
    const newMedia = {
      ...extractFilesMeta(req.files).files,
      id: newId,
    };

    const relativeItemPath = `content/media/${newId}.json`;
    const itemPath = `${dbDir}/${relativeItemPath}`;

    await utils.save(itemPath, newMedia);

    await gitUtils.commit([itemPath], repositoryRoot, {
      message: `Flatlify created file: ${relativeItemPath}`,
    });

    res.send(newMedia);
  });

  router.delete("/:itemId", async (req, res) => {
    const { itemId } = req.params;

    await deleteItem(itemId, repositoryRoot, dbDir);

    res.send({ data: {} });
  });

  return router;
};

async function deleteItem(itemId, repositoryRoot, dbDir) {
  const relativeItemPath = `media/${itemId}.json`;
  const mediaPath = `${dbDir}/${relativeItemPath}`;

  await utils.remove(mediaPath);

  await gitUtils.commit([mediaPath], repositoryRoot, {
    message: `Flatlify deleted file: ${relativeItemPath}`,
    remove: true,
  });

  return {};
}
