const { Router } = require("express");
const fileController = require("../controllers/fileController");
const fileRouter = new Router();

fileRouter.get("/:filename", fileController.getFile);
fileRouter.get("/download/:prefix/:originalName", fileController.downloadFile);
module.exports = fileRouter;
