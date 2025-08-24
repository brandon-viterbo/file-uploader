require("dotenv").config();
const process = require("node:process");
const bcrypt = require("bcryptjs");
const path = require("node:path");

const express = require("express");
const session = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { PrismaClient } = require("./generate/prisma");
const passport = require("passport");
const indexRouter = require("./routes/indexRouter");
const LocalStrategy = require("passport-local").Strategy;

const PORT = parseInt(process.env.PORT);
const app = express();
app.set("view engine", "ejs");
const assetsPath = path.join(__dirname, "public");
app.set("views", path.join(__dirname, "views"));

app.use(
  session({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // ms
    },
    secret: "a santa at nasa",
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  }),
);
app.use(passport.session());
app.use(express.static(assetsPath));
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);

app.listen(PORT, () => {
  console.log(`Starting server for file-uploader, listening on port ${PORT}`);
});
