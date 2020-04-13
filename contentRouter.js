const express = require("express");
const path = require("path");
const { orderBy, slice } = require("lodash");
const utils = require("./utils/common");
const gitUtils = require("./git-utils");
const media = require("./utils/media");

const { getContentType } = utils;

module.exports = (root, gitRepositoryRoot) => {
  const { extractFilesMeta, fileFieldsAppendSrc } = media(root);

  async function getMany(req, res) {
    const contentType = getContentType(req);

    const pagination =
      req.query && req.query.pagination ? JSON.parse(req.query.pagination) : {};
    const sort = req.query && req.query.sort ? JSON.parse(req.query.sort) : {};

    const _start = (pagination.page - 1) * pagination.perPage || 0;
    const _end = pagination.page * pagination.perPage || 25;
    const _order = sort.order || "ASC";
    const _sort = sort.field || "id";

    const contentPath = path.resolve(root, `${contentType}`);
    const files = await utils.readCollectionList(contentPath);
    const items = fileFieldsAppendSrc(
      slice(orderBy(files, [_sort], [_order]), _start, _end),
    );

    res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");
    res.setHeader("X-Total-Count", items.length);
    res.send({
      data: items,
      total: files.length,
    });
  }

  async function getOne(req, res) {
    const { itemId } = req.params;
    const contentType = getContentType(req);

    const contentPath = path.resolve(root, `${contentType}`, `${itemId}.json`);
    const [data] = fileFieldsAppendSrc([await utils.read(contentPath)]);
    res.send({ data });
  }

  async function update(itemId, contentType, updateParams, gitRepositoryRoot) {
    const relativeContentPath = `${contentType}/${itemId}.json`;
    const contentPath = `${root}/${relativeContentPath}`;

    const item = await utils.read(contentPath);
    const newItem = {
      ...item,
      ...updateParams,
    };

    await utils.save(contentPath, newItem);

    await gitUtils.commit([contentPath], gitRepositoryRoot, {
      message: `Flatlify updated file: ${relativeContentPath}`,
    });
    return newItem;
  }

  async function updateOne(req, res) {
    const contentType = getContentType(req);
    const { itemId } = req.params;
    const params = req.body;

    const data = await update(
      itemId,
      contentType,
      {
        ...params,
        ...extractFilesMeta(req.files),
      },
      gitRepositoryRoot,
    );

    res.status(200).send({ data });
  }

  async function updateMany(req, res) {
    const contentType = getContentType(req);
    const params = req.body;
    const { ids } = req.query;

    const updatePromises = ids.map((id) =>
      update(id, contentType, params, gitRepositoryRoot),
    );

    await Promise.all(updatePromises);

    res.status(200).send({ data: ids });
  }

  async function createOne(req, res) {
    const contentType = getContentType(req);

    const contentPath = path.resolve(root, `${contentType}`);
    const items = await utils.readCollectionList(contentPath);
    const newId = utils.getNewIdFromDatabaseItems(items);

    const newContentType = {
      ...req.body,
      ...extractFilesMeta(req.files),
      id: newId,
    };

    const relativeItemPath = `${contentType}/${newId}.json`;
    const itemPath = `${root}/${relativeItemPath}`;

    await utils.save(itemPath, newContentType);

    await gitUtils.commit([itemPath], gitRepositoryRoot, {
      message: `Flatlify created file: ${relativeItemPath}`,
    });

    res.send(newContentType);
  }

  async function deleteItem(contentType, itemId, gitRepositoryRoot) {
    const relativeItemPath = `${contentType}/${itemId}.json`;
    const contentItemPath = `${root}/${relativeItemPath}`;

    await utils.remove(contentItemPath);

    await gitUtils.commit([contentItemPath], gitRepositoryRoot, {
      message: `Flatlify deleted file: ${relativeItemPath}`,
      remove: true,
    });

    return {};
  }

  async function deleteOne(req, res) {
    const { itemId } = req.params;
    const contentType = getContentType(req);

    await deleteItem(contentType, itemId, gitRepositoryRoot);

    res.send({ data: {} });
  }

  async function deleteMany(req, res) {
    const contentType = getContentType(req);
    const ids = req.body;

    const deletePromises = ids.map((id) =>
      deleteItem(contentType, id, gitRepositoryRoot),
    );
    await Promise.all(deletePromises);

    res.send({ data: {} });
  }

  const router = express.Router();

  router.get("/:contentType", getMany);

  router.get("/:contentType/:itemId", getOne);

  router.put("/:contentType/:itemId", updateOne);

  router.put("/:contentType", updateMany);

  router.post("/:contentType", createOne);

  router.delete("/:contentType/:itemId", deleteOne);

  router.delete("/:contentType", deleteMany);

  return router;
};
