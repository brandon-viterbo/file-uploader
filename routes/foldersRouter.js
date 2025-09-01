const { Router } = require("express");
const { body, validationResult } = require("express-validator");
const { PrismaClient } = require("../generate/prisma");
const db = new PrismaClient();
const foldersController = require("../controllers/foldersController");
const { error } = require("console");
const foldersRouter = new Router();

foldersRouter.get("/", foldersController.getFolders);

foldersRouter.get("/*subfolders", foldersController.getSubfolders);

foldersRouter.post(
  "/*subfolders/addFolder",
  body("newFolder")
    .notEmpty()
    .trim()
    .matches(
      /^[^\s^\x00-\x1f\\?*:"";<>|\/.][^\x00-\x1f\\?*:"";<>|\/]*[^\s^\x00-\x1f\\?*:"";<>|\/.]+$/,
    )
    .withMessage("Not a valid folder name")
    .custom(async (value) => {
      const existingFolder = await db.folder.findFirst({
        where: {
          name: value,
        },
      });
      if (existingFolder) {
        throw new Error(`Folder "${value}" already in parent folder`);
      }
    })
    .withMessage(`Folder already exists`),
  async (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.send({ errors: result.array() });
    }

    foldersController.addFolder(req, res, next);
  },
);
module.exports = foldersRouter;
