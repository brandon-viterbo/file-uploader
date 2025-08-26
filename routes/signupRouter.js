const { Router } = require("express");
const { body, validationResult } = require("express-validator");
const { PrismaClient } = require("../generate/prisma");
const signupController = require("../controllers/signupController");
const signupRouter = Router();
const db = new PrismaClient();

signupRouter.get("/", signupController.getSignup);
signupRouter.post(
  "/addUser",
  body("email")
    .notEmpty()
    .trim()
    .isEmail()
    .custom(async (value) => {
      const existingUser = await db.user.findUnique({
        where: {
          email: value,
        },
      });

      if (existingUser) {
        throw new Error("Email address already used");
      }
    })
    .withMessage("Email address already used"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be of length 6"),
  body("confirmPassword")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Passwords don't match"),
  (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.send({ errors: result.array() });
    }

    signupController.addUser(req, res, next);
  },
);
module.exports = signupRouter;
