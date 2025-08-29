const { Router } = require("express");
const uploadController = require("../controllers/uploadController");
const uploadRouter = new Router();

uploadRouter.get("/", uploadController.getUploads);
uploadRouter.post("/", (req, res) => {
  console.log(req.body.image);
  res.redirect("/");
});
module.exports = uploadRouter;
