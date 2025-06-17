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
const itemRoutes = require("./routes/itemRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");

// subscription routes mounted before JSON parsing for Stripe webhook
app.use("/api/subscription", subscriptionRoutes);
app.use(express.json());
app.use("/api", [authRoutes, itemRoutes]);

app.use(errorHandler);

let httpServer = http.createServer(app);

const startServer = () => {
  const port = process.env.HTTP_PORT || 3000;
  
  httpServer.listen(port, () => {
    console.log(`Server started on port ${port}`);
    console.log(`Running on branch ${process.env.GIT_BRANCH || "unknown"}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use. Attempting to kill the process...`);
      const { exec } = require('child_process');
      exec(`lsof -i :${port} | grep LISTEN | awk '{print $2}'`, (error, stdout, stderr) => {
        if (stdout) {
          const pid = stdout.trim();
          console.log(`Found process ${pid} using port ${port}. Attempting to kill it...`);
          exec(`kill -9 ${pid}`, (killError) => {
            if (killError) {
              console.error('Failed to kill the process:', killError);
              process.exit(1);
            } else {
              console.log(`Successfully killed process ${pid}`);
              setTimeout(startServer, 1000);
            }
          });
        } else {
          console.error('Could not find process using the port');
          process.exit(1);
        }
      });
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
};

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  httpServer.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  httpServer.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

startServer();
