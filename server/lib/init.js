// environment variables
const env = process.env.NODE_ENV;
const config = require("./../config/config.json");
if (env === "dev" || env === "test" || env === "prod") {
  Object.keys(config[env]).forEach(
    (key) => (process.env[key] = config[env][key])
  );
}

// mongodb
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI);
module.exports = { mongoose };

// cookies
const cookieSession = require("cookie-session");
const keys = [
  process.env.COOKIE_KEY_1,
  process.env.COOKIE_KEY_2,
  process.env.COOKIE_KEY_3,
];
module.exports = {
  cookieSession: cookieSession({
    name: "auth",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 1 month
    keys: keys,
    httpOnly: false,
  }),
  mongoose,
};
