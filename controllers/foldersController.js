const { PrismaClient } = require("../generate/prisma");
const db = new PrismaClient();

const findSubfolder = async (req) => {
  let folder;

  for (let i = 0; i < req.params.subfolders.length; i++) {
    const whereParam =
      i < req.params.subfolders.length - 1
        ? {
            userId: parseInt(req.user.id),
            id: parseInt(req.params.subfolders[i]),
            children: { some: { id: parseInt(req.params.subfolders[i + 1]) } },
          }
        : {
            userId: parseInt(req.user.id),
            id: parseInt(req.params.subfolders[i]),
          };
    folder = await db.folder.findFirstOrThrow({
      select: {
        id: true,
        children: true,
        name: true,
      },
      where: whereParam,
    });
  }

  return folder;
};

exports.getFolders = async (req, res) => {
  if (req.user) {
    const { folders } = await db.user.findUniqueOrThrow({
      relationLoadStrategy: "join",
      include: {
        folders: {
          where: {
            parentId: null,
          },
        },
      },
      where: {
        id: req.user.id,
      },
    });
    res.render("folders", {
      title: "My Folders",
      user: req.user,
      folders: folders,
      postUrl: req.originalUrl,
    });
  } else {
    res.redirect("/");
  }
};

exports.getSubfolders = async (req, res) => {
  const folder = await findSubfolder(req);
  if (req.user && folder) {
    res.render("folders", {
      title: folder.name,
      user: req.user,
      folders: folder.children,
      postUrl: req.originalUrl,
    });
  } else {
    res.redirect("/folders");
  }
};

exports.addFolder = async (req, res, next) => {
  const isPathValid = await findSubfolder(req);
  const parentId = parseInt(req.params.subfolders.at(-1));
  if (isPathValid) {
    await db.folder.create({
      data: {
        name: req.body.newFolder,
        userId: parseInt(req.user.id),
        parentId: parentId,
      },
    });
  }

  res.redirect(`/folders/${req.params.subfolders.join("/")}`);
};
