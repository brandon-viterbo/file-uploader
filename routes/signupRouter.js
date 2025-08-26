const { Router } = require("express");
const { body, validationResult } = require("express-validator");
const signupController = require("../controllers/signupController");
const signupRouter = Router();

signupRouter.get("/", signupController.getSignup);

module.exports = signupRouter;
