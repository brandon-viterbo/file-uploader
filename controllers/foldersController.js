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
        children: { include: { children: true } },
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
          include: { children: true },
          where: {
            parentId: null,
          },
        },
      },
      where: {
        id: req.user.id,
      },
    });

    const { files } = await db.user.findUniqueOrThrow({
      relationLoadStrategy: "join",
      include: {
        files: {
          where: {
            folderId: null,
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
      files: files,
    });
  } else {
    res.redirect("/");
  }
};

exports.getSubfolders = async (req, res) => {
  const folder = await findSubfolder(req);
  if (req.user && folder) {
    const { files } = await db.user.findUniqueOrThrow({
      relationLoadStrategy: "join",
      include: {
        files: {
          where: {
            folderId: parseInt(
              req.params.subfolders[req.params.subfolders.length - 1],
            ),
          },
        },
      },
      where: {
        id: req.user.id,
      },
    });
    res.render("folders", {
      id: folder.id,
      title: folder.name,
      user: req.user,
      folders: folder.children,
      postUrl: req.originalUrl,
      files: files,
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

exports.deleteFolder = async (req, res, next) => {
  const deleteFiles = db.file.deleteMany({
    where: {
      folderId: parseInt(req.params.folderId),
      userId: parseInt(req.user.id),
    },
  });

  const deleteFolder = db.folder.delete({
    where: {
      id: parseInt(req.params.folderId),
      children: { none: {} },
      userId: parseInt(req.user.id),
    },
  });

  const transaction = await db.$transaction([deleteFiles, deleteFolder]);

  res.redirect("/");
};

exports.renameFolder = async (req, res, next) => {
  try {
    await db.folder.update({
      where: {
        id: parseInt(req.params.folderId),
        userId: parseInt(req.user.id),
        OR: [
          {
            parent: { children: { none: { name: req.body.newName } } },
          },
          {
            parent: null,
            user: {
              folders: { none: { parentId: null, name: req.body.newName } },
            },
          },
        ],
      },
      data: {
        name: req.body.newName,
      },
    });
  } catch (err) {
    res.redirect("/");
  }

  res.redirect("/");
};
