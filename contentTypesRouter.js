const path = require("path");
const fs = require("fs").promises;
const express = require("express");
const { orderBy, slice } = require("lodash");
const gitUtils = require("./git-utils");
const utils = require("./utils/common");

module.exports = (dbDir, repositoryRoot) => {
  async function getMany(req, res) {
    const pagination =
      req.query && req.query.pagination ? JSON.parse(req.query.pagination) : {};
    const sort = req.query && req.query.sort ? JSON.parse(req.query.sort) : {};

    const _start = (pagination.page - 1) * pagination.perPage || 0;
    const _end = pagination.page * pagination.perPage || 25;
    const _order = sort.order || "ASC";
    const _sort = sort.field || "id";

    const contentPath = path.resolve(dbDir, "content-types");
    const files = await utils.readCollectionList(contentPath);
    const items = slice(orderBy(files, [_sort], [_order]), _start, _end);

    res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");
    res.setHeader("X-Total-Count", items.length);
    res.send({
      data: items,
      total: files.length,
    });
  }

  async function getOne(req, res) {
    const { itemId } = req.params;

    const contentPath = path.resolve(dbDir, "content-types", `${itemId}.json`);
    const data = await utils.read(contentPath);
    res.send({ data });
  }

  async function createOne(req, res) {
    const contentPath = path.resolve(dbDir, "content-types");
    const items = await utils.readCollectionList(contentPath);

    const newId = utils.getNewIdFromDatabaseItems(items);

    const newContentType = {
      ...req.body,
      id: newId,
    };
    const relativeItemPath = `content-types/${newId}.json`;
    const itemPath = `${dbDir}/${relativeItemPath}`;
    const newDirPath = path.resolve(dbDir, `${req.body.type.toLowerCase()}`);

    await Promise.all([
      utils.save(itemPath, newContentType, utils.ensureDir(newDirPath)),
    ]);

    await gitUtils.commit([itemPath], repositoryRoot, {
      message: `Flatlify created file: ${relativeItemPath}`,
    });

    res.send(newContentType);
  }

  async function update(itemId, contentType, updateParams, repositoryRoot) {
    const relativeContentPath = `${contentType}/${itemId}.json`;
    const contentPath = `${dbDir}/${relativeContentPath}`;

    const item = await utils.read(contentPath);
    const newItem = {
      ...item,
      ...updateParams,
    };

    if (updateParams.type) {
      const contentFolderPath = path.resolve(
        dbDir,
        "content",
        item.type.toLowerCase(),
      );
      const newContentFolderPath = path.resolve(
        dbDir,
        "content",
        updateParams.type.toLowerCase(),
      );
      utils.ensureDir(contentFolderPath);
      await fs.rename(contentFolderPath, newContentFolderPath);
    }
    await utils.save(contentPath, newItem);

    await gitUtils.commit([contentPath], repositoryRoot, {
      message: `Flatlify updated file: ${relativeContentPath}`,
    });

    return newItem;
  }

  async function updateOne(req, res) {
    const { itemId } = req.params;
    const params = req.body;

    const data = await update(itemId, "content-types", params, repositoryRoot);

    res.status(200).send({ data });
  }

  async function updateMany(req, res) {
    const params = req.body;
    const { ids } = req.query;

    const updatePromises = ids.map((id) =>
      update(id, "content-types", params, repositoryRoot),
    );
    await Promise.all(updatePromises);

    res.status(200).send({ data: ids });
  }

  async function deleteItem(root, contentType, itemId, repositoryRoot) {
    const relativeItemPath = `${contentType}/${itemId}.json`;
    const contentItemPath = `${root}/content/${relativeItemPath}`;

    const { type } = await utils.read(contentItemPath);
    const contentFolderPath = path.resolve(root, `${type.toLowerCase()}`);

    await gitUtils.commit([contentItemPath], repositoryRoot, {
      message: `Flatlify deleted file: ${relativeItemPath}`,
      remove: true,
    });

    await Promise.all([
      utils.remove(contentItemPath),
      utils.remove(contentFolderPath),
    ]);
    return {};
  }

  async function deleteOne(req, res) {
    const { itemId } = req.params;

    await deleteItem(dbDir, "content-types", itemId, repositoryRoot);

    res.send({ data: {} });
  }

  async function deleteMany(req, res) {
    const ids = req.body;

    const deletePromises = ids.map((id) =>
      deleteItem(dbDir, "content-types", id, repositoryRoot),
    );
    await Promise.all(deletePromises);

    res.send({ data: {} });
  }

  const router = express.Router();

  router.get("/", getMany);

  router.get("/:itemId", getOne);

  router.put("/:itemId", updateOne);

  router.put("/", updateMany);

  router.post("/", createOne);

  router.delete("/:itemId", deleteOne);

  router.delete("/", deleteMany);

  return router;
};
