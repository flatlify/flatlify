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

  const extractFileMeta = (file) => {
    const fileMeta = {
      relativeSrc: `/${path.relative(dbDir, file.path)}`,
      filename: file.filename,
      size: file.size,
      mimetype: file.mimetype,
    };
    return fileMeta;
  };

  return {
    upload,
    extractFileMeta,
  };
}
module.exports = (root, publicBaseUrl) => createMedia(root, publicBaseUrl);
