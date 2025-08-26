const bcrypt = require("bcryptjs");
const { PrismaClient } = require("../generate/prisma");

const db = new PrismaClient();

exports.getSignup = async (req, res) => {
  res.render("signup", { title: "Sign Up", user: false });
};

exports.addUser = async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await db.user.create({
      data: {
        email: req.body.email,
        name: req.body.username,
        password: hashedPassword,
      },
    });

    res.redirect("/");
  } catch (err) {
    console.error(err);
    return next(err);
  }
};
