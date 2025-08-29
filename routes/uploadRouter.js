const { Router } = require("express");
const uploadController = require("../controllers/uploadController");
const multer = require("multer")
const upload = multer({ dest: "uploads/" })
const uploadRouter = new Router();

uploadRouter.get("/", uploadController.getUploads);
uploadRouter.post("/", upload.single("image"), (req, res) => {
  console.log(req.body.image);
  res.redirect("/");
});

module.exports = uploadRouter;
