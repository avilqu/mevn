const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oidc");
const FacebookStrategy = require("passport-facebook");

const User = mongoose.model("user");
const messages = require("../config/messages");

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
        if (!user) throw new Error(messages.errors.wrongCredentials);
        else if (!user.password && user.googleId)
          throw new Error(messages.errors.googleUser);
        else if (!user.password && !user.googleId)
          throw new Error(messages.errors.unverifiedUser);
        else if (!user.validPassword(password))
          throw new Error(messages.errors.wrongCredentials);
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
      clientID: process.env.GOOGLE_OAUTH_ID,
      clientSecret: process.env.GOOGLE_OAUTH_SECRET,
      callbackURL: process.env.API_URL + process.env.GOOGLE_OAUTH_CALLBACK,
    },
    async (accessToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
          if (user.email != profile.emails[0].value) {
            user.email = profile.emails[0].value;
            user.save();
          }
          return done(null, user);
        } else {
          user = await User.findOne({
            email: profile.emails[0].value,
          });
          if (user) {
            user.googleId = profile.id;
            user.save();
            return done(null, user);
          }
          const newUser = await new User({
            googleId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
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

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_OAUTH_ID,
      clientSecret: process.env.FACEBOOK_OAUTH_SECRET,
      callbackURL: process.env.API_URL + process.env.FACEBOOK_OAUTH_CALLBACK,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ facebookId: profile.id });
        if (user) {
          if (user.email != profile.emails[0].value) {
            user.email = profile.emails[0].value;
            user.save();
          }
          return done(null, user);
        } else {
          user = await User.findOne({
            email: profile.emails[0].value,
          });
          if (user) {
            user.facebookId = facebook.id;
            user.save();
            return done(null, user);
          }
          const newUser = await new User({
            facebookId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
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
