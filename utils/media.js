const multer = require("multer");
const path = require("path");
const fse = require("fs-extra");
const get = require("lodash/get");

function createMedia(root, publicBaseUrl) {
  const storage = multer.diskStorage({
    async destination(req, file, callback) {
      const destinationDir = path.resolve(root, publicBaseUrl);
      await fse.ensureDir(destinationDir);

      callback(null, destinationDir);
    },
    async filename(req, file, cb) {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const fileMeta = path.parse(file.originalname);
      cb(null, `${fileMeta.name}-${uniqueSuffix}${fileMeta.ext}`);
    },
  });
  const upload = multer({ storage });

  const appendSrc = (file) => {
    return {
      ...file,
      src: `${publicBaseUrl}/${file.relativeSrc}`,
    };
  };

  const fileFieldsAppendSrc = (files = []) =>
    files.map((file) => {
      const updatedEntry = { ...file };
      // eslint-disable-next-line no-restricted-syntax
      for (const fieldName in file) {
        if (Array.isArray(file[fieldName])) {
          updatedEntry[fieldName] = file[fieldName].map((field) => {
            if (get(field, "filename")) {
              return appendSrc(field);
            }
            return field;
          });
        } else if (get(file[fieldName], "filename")) {
          updatedEntry[fieldName] = appendSrc(updatedEntry[fieldName]);
        }
      }
      return updatedEntry;
    });

  const extractFilesMeta = (files = []) => {
    /* eslint-disable no-param-reassign */
    return files.reduce((result, file) => {
      const newFieldValue = {
        relativeSrc: `/${path.relative(root, file.path)}`,
        filename: file.filename,
        size: file.size,
        mimetype: file.mimetype,
      };
      if (typeof result[file.fieldname] !== "undefined") {
        if (Array.isArray(result[file.fieldname])) {
          result[file.fieldname] = [...result[file.fieldname], newFieldValue];
        } else {
          result[file.fieldname] = [result[file.fieldname], newFieldValue];
        }
      } else {
        result[file.fieldname] = newFieldValue;
      }
      return result;
    }, {});
  };

  return {
    upload,
    extractFilesMeta,
    fileFieldsAppendSrc,
  };
}
module.exports = (root, publicBaseUrl) => createMedia(root, publicBaseUrl);
