const { Router } = require("express");
const uploadController = require("../controllers/uploadController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const uploadRouter = new Router();

uploadRouter.post("/:folderId", upload.single("image"), uploadController.uplaodFile
);

module.exports = uploadRouter;
