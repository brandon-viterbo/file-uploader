const { PrismaClient } = require("../generate/prisma")
const db = new PrismaClient();

exports.getFolders = async (req, res) => {
  if (req.user) {
    const { email, folders } = await db.user.findUniqueOrThrow({
      relationLoadStrategy: "join",
      select: {
        email: true,
        folders: true
      },
      where: {
        id: req.user.id
      }
    })
    res.render("folders", { title: "My Folders", user: req.user, folders: folders });
  } else {
    res.redirect("/");
  }
}

exports.addFolder = async (req, res, next) => {
  await db.folder.create({
    data: { name: req.body.newFolder, userId: req.user.id }
  })
 res.redirect("/folders")
}