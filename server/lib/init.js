// environment variables
const env = process.env.NODE_ENV;
const config = require("../config/config.json");
if (env === "dev" || env === "test" || env === "prod") {
  Object.keys(config[env]).forEach(
    (key) => (process.env[key] = config[env][key])
  );
}

// mongodb init
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI);

// cookies config
const keys = [
  process.env.COOKIE_KEY_1,
  process.env.COOKIE_KEY_2,
  process.env.COOKIE_KEY_3,
];
const cookieSession = require("cookie-session")({
  name: "auth",
  maxAge: 30 * 24 * 60 * 60 * 1000, // 1 month
  keys,
  httpOnly: false,
});

module.exports = {
  cookieSession,
  mongoose,
};
