const { PrismaClient } = require("../generate/prisma")
const db = new PrismaClient()

exports.uploadFile = async (req, res, next) => {
  const splitFilename = req.file.filename.split("-")
  const uniquePrefix = splitFilename[0] + "-" + splitFilename[1]
  
  try {
    await db.file.findFirstOrThrow({
      where: {
        folderId: parseInt(req.params.folderId),
        originalname: req.file.originalname
      }
    })
    next(new Error("File with same name already exists in this folder"))
  } catch (err) {
    await db.file.create({
      data: {
        prefix: uniquePrefix,
        folderId: (req.params.folderId === "root") ? null : parseInt(req.params.folderId),
        originalName: req.file.originalname,
        url: req.file.path,
        userId: parseInt(req.user.id)
      }
    })
  }
  res.redirect("/");
}