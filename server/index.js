const express = require("express");
const passport = require("passport");
const http = require("http");
require("dotenv").config();

require("./lib/init");
require("./models/user");
require("./models/history");
require("./models/item");
require("./lib/passport");

const { errorHandler } = require("./lib/middleware");
const { cookieSession } = require("./lib/init");

const app = express();
app.use(express.json());
app.use(cookieSession);
app.use(passport.initialize());
app.use(passport.session());
// app.locals.messages = require("./config/messages");

// fix for passport > 0.5 & + cookie-session
app.use(function (req, res, next) {
  if (req.session && !req.session.regenerate) {
    req.session.regenerate = (cb) => {
      cb();
    };
  }
  if (req.session && !req.session.save) {
    req.session.save = (cb) => {
      cb();
    };
  }
  next();
});

const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/itemRoutes");

app.use("/api", [authRoutes, itemRoutes]);
app.use(errorHandler);

let httpServer = http.createServer(app);

httpServer.listen(process.env.HTTP_PORT, () => {
  console.log(`Server started on port ${process.env.HTTP_PORT}.`);
  console.log(`Running on branch: ${process.env.GIT_BRANCH || "unknown"}`);
});
