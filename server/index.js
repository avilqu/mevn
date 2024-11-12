const express = require("express");
const passport = require("passport");
const http = require("http");
const https = require("https");
const fs = require("fs");

require("./lib/init");
require("./models/user");
require("./lib/passport");

const { errorHandler } = require("./lib/errorHandler");
const { cookieSession } = require("./lib/init");

const app = express();
app.use(express.json());
app.use(cookieSession);
app.use(passport.initialize());
app.use(passport.session());

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

app.use("/api", [authRoutes]);

app.get("*", (req, res) => {
  res.sendFile(`${process.cwd()}/client/dist/index.html`);
});

app.use(errorHandler);

let httpServer = http.createServer(app);
let httpsServer = https.createServer(
  {
    key: fs.readFileSync("./server/ssl/key.pem", "utf-8"),
    cert: fs.readFileSync("./server/ssl/cert.pem", "utf-8"),
    ca: fs.readFileSync("./server/ssl/chain.pem", "utf-8"),
  },
  app
);

httpServer.listen(process.env.HTTP_PORT, () => {
  console.log(
    `Server started on port ${process.env.HTTP_PORT} (${process.env.NODE_ENV}).`
  );
});

httpsServer.listen(process.env.HTTPS_PORT, () => {
  console.log(
    `Secure server started on port ${process.env.HTTPS_PORT} (${process.env.NODE_ENV}).`
  );
});
