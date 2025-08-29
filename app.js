require("dotenv").config();
const process = require("node:process");
const bcrypt = require("bcryptjs");
const path = require("node:path");

const express = require("express");
const session = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { PrismaClient } = require("./generate/prisma");
const db = new PrismaClient();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const indexRouter = require("./routes/indexRouter");
const signupRouter = require("./routes/signupRouter");
const loginRouter = require("./routes/loginRouter");
const uploadRouter = require("./routes/uploadRouter");

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

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await db.user.findUnique({
        where: {
          name: username,
        },
      });
      const match = await bcrypt.compare(password, user.password);

      if (!user) {
        return done(null, false, { message: "Incorrect email" });
      }
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id: id,
      },
    });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use("/upload", uploadRouter);
app.use("/login", loginRouter);
app.use("/signup", signupRouter);
app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});
app.use("/", indexRouter);

app.listen(PORT, () => {
  console.log(`Starting server for file-uploader, listening on port ${PORT}`);
});
