const { Router } = require("express");
const loginController = require("../controllers/loginController");
const passport = require("passport");
const loginRouter = Router();

loginRouter.get("/", loginController.getLogin);
loginRouter.post(
  "/authenticate",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  }),
);

module.exports = loginRouter;
