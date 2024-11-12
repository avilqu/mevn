const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oidc");

const User = mongoose.model("user");
const strings = require("../config/strings");

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
        if (!user) done(new Error(strings.ERR_WRONG_CREDENTIALS));
        else if (!user.password && user.googleId)
          done(new Error(strings.ERR_GOOGLE_USER));
        else if (!user.password && !user.googleId)
          done(new Error(strings.ERR_UNVERIFIED_USER));
        else if (!user.validPassword(password))
          done(new Error(strings.ERR_WRONG_CREDENTIALS));
        else return done(null, user);
      } catch (e) {
        return done(e);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://localhost:3443/api/login/google/callback",
      scope: ["profile"],
    },
    async (accessToken, profile, done) => {
      console.log(profile);
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
          if (
            user.email != profile.emails[0].value
            // || user.pic != profile.photos[0].value
          ) {
            user.email = profile.emails[0].value;
            // user.pic = profile.photos[0].value;
            user.save();
          }
          return done(null, user);
        } else {
          user = await User.findOne({
            email: profile.emails[0].value,
          });
          if (user) {
            user.googleId = profile.id;
            // user.pic = profile.photos[0].value;
            user.save();
            return done(null, user);
          }
          const newUser = await new User({
            googleId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            // pic: profile.photos[0].value,
            verified: true,
          }).save();
          return done(null, newUser);
        }
      } catch (e) {
        return done(e);
      }
    }
  )
);
