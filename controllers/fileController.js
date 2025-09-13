const { PrismaClient } = require("../generate/prisma");
const db = new PrismaClient();

exports.getFile = async (req, res, next) => {
  try {
    const splitFilename = req.params.filename.split("-");
    const uniquePrefix = splitFilename[0] + "-" + splitFilename[1];
    const originalName = splitFilename.slice(2, splitFilename.length).join("-");
    const file = await db.file.findFirstOrThrow({
      where: {
        originalName: originalName,
        prefix: uniquePrefix,
        userId: parseInt(req.user.id),
      },
    });
    const uploadTime = new Date(parseInt(file.prefix.split("-")[0]) * 1000);
    res.render("file", {
      title: file.originalName,
      file: file,
      user: req.user,
      uploadTime: uploadTime,
    });
  } catch (err) {
    res.redirect("/");
  }
};

exports.downloadFile = async (req, res, next) => {
  try {
    const file = await db.file.findFirstOrThrow({
      where: {
        originalName: req.params.originalName,
        prefix: req.params.prefix,
        userId: parseInt(req.user.id),
      },
    });
    res.download(file.url);
  } catch (err) {
    next(err);
  }
};
