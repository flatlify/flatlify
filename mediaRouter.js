const express = require("express");
const { orderBy, slice } = require("lodash");
const { v4: uuidv4 } = require("uuid");
const utils = require("./utils/common");
const gitUtils = require("./git-utils");
const media = require("./utils/media");

module.exports = (dbDir, repositoryRoot, publicBaseUrl) => {
  const { upload, extractFileMeta, fileFieldsAppendSrc } = media(
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
    const [file] = req.files;
    const newMedia = {
      ...extractFileMeta(file),
      id: newId,
    };

    const relativeItemPath = `content/media/${newId}.json`;
    const metaFilePath = `${dbDir}/${relativeItemPath}`;

    await utils.save(metaFilePath, newMedia);

    await gitUtils.commit([metaFilePath, file.path], repositoryRoot, {
      message: `Flatlify created files: ${relativeItemPath}, ${newMedia.relativeSrc}`,
    });

    res.send(newMedia);
  });

  router.delete("/:itemId", async (req, res) => {
    const { itemId } = req.params;

    await deleteItem(itemId, repositoryRoot, dbDir);

    res.send({ data: {} });
  });

  router.delete("/", async (req, res) => {
    const ids = req.body;
    const deletePromises = ids.map((itemId) =>
      deleteItem(itemId, repositoryRoot, dbDir),
    );
    await Promise.all(deletePromises);

    res.send({ data: ids });
  });

  return router;
};

async function deleteItem(itemId, repositoryRoot, dbDir) {
  const relativeItemPath = `content/media/${itemId}.json`;
  const metaFilePath = `${dbDir}/${relativeItemPath}`;
  const fileMetadata = await utils.read(metaFilePath);
  const filePath = `${dbDir}/${fileMetadata.relativeSrc}`;

  await Promise.all([utils.remove(metaFilePath), utils.remove(filePath)]);

  await gitUtils.commit([metaFilePath, filePath], repositoryRoot, {
    message: `Flatlify deleted files: ${relativeItemPath}, ${filePath}`,
    remove: true,
  });
}
