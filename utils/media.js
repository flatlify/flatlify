const multer = require("multer");
const path = require("path");
const fse = require("fs-extra");

function createMedia(dbDir, mediaUploadDir) {
  const storage = multer.diskStorage({
    async destination(req, file, callback) {
      const destinationDir = path.resolve(dbDir, mediaUploadDir);
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

  const extractFilesMeta = (files = []) => {
    /* eslint-disable no-param-reassign */
    return files.reduce((result, file) => {
      const newFieldValue = {
        relativeSrc: `/${path.relative(dbDir, file.path)}`,
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
  };
}
module.exports = (root, publicBaseUrl) => createMedia(root, publicBaseUrl);
