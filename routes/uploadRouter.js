const { Router } = require("express");
const uploadController = require("../controllers/uploadController");
const uploadRouter = new Router();

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `uploads/`)
  },
  filename: function (req, file, cb) {
    const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniquePrefix + '-' + file.originalname)
  }
})
const upload = multer({ storage: storage });

uploadRouter.post("/:folderId", upload.single("uploaded_file"), uploadController.uploadFile
);

module.exports = uploadRouter;
