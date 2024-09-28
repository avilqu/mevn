const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = mongoose.model("user");
const { AppError } = require("./../lib/errorHandler");

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (data, done) => {
  const user = await User.findById(data._id);
  done(null, user);
});

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email: email });

        if (!user || !user.validPassword(password)) {
          done(new AppError("wrong-credentials"));
        } else if (!user.password || !user.verified) {
          done(new AppError("unverified-user"));
        } else return done(null, user);
      } catch (e) {
        console.log(e);

        return done(e);
      }
    }
  )
);
