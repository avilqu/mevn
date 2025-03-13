const express = require("express");
const router = express.Router();
const passport = require("passport");
const { mailer } = require("../lib/mailer");
const User = require("../lib/init").mongoose.model("user");
const messages = require("../lib/messages");
const {
  auth,
  authAdmin,
  checkMongoId,
  maintenanceMode,
} = require("../lib/middleware");

const login = (strategy) => {
  return (req, res, next) => {
    passport.authenticate(
      strategy,
      { failureRedirect: "/login" },
      (err, user) => {
        if (err) return next(err);
        req.login(user, (err) => {
          if (err) return next(err);
          else if (strategy == "local")
            res.json({ status: "success", data: { user } });
          else res.redirect(`${process.env.CLIENT_URL}/?auth`);
          user.updateLastConnected();
        });
      }
    )(req, res, next);
  };
};

const getActiveUser = async (req, res) => {
  res.json({ status: "success", data: { user: req.user } });
};

const sendPasswordToken = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) throw new Error(messages.errors.noUser);
    const token = user.generateToken();
    await mailer.resetPassword({
      email: user.email,
      baseUrl: req.headers.host,
      id: user.id,
      token: token,
    });
    return res.json({
      status: "success",
      message: messages.info.passwordResetLink,
    });
  } catch (e) {
    return next(e);
  }
};

const createPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) throw new Error(messages.errors.noUser);
    else if (user.verifyToken(req.params.token)) {
      user.password = req.body.password;
      user.verified = true;
      await user.save();
      return res.json({
        status: "success",
        data: { user },
        message: messages.info.passwordSaved,
      });
    }
  } catch (e) {
    return next(e);
  }
};

const createUser = async (req, res, next) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) throw new Error(messages.errors.existingUser);
    if (req.url == "/user/create")
      user = new User({
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        verified: false,
      });
    else
      user = new User({
        name: req.body.name,
        email: req.body.email,
        role: "user",
        verified: false,
      });

    await user.save();
    const token = user.generateToken("10d");
    await mailer.newUser({
      name: user.name,
      email: user.email,
      baseUrl: req.headers.host,
      id: user.id,
      token: token,
    });
    return res.json({
      status: "success",
      data: { user },
      message: messages.info.activationLink,
    });
  } catch (e) {
    return next(e);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) throw new Error(messages.errors.noUser);
    const oldValues = { ...user.toObject() };
    const modelSchema = User.schema.paths;
    await user.updateOne(req.body);
    const History = require("../lib/init").mongoose.model("History");
    const changes = [];
    for (const key in req.body) {
      if (modelSchema[key]) {
        const oldValue =
          oldValues[key] instanceof Date
            ? oldValues[key].toISOString()
            : String(oldValues[key]);
        const newValue = String(req.body[key]);
        if (oldValue !== newValue) {
          changes.push({
            field: key,
            oldValue: oldValues[key],
            newValue: req.body[key],
          });
        }
      }
    }
    console.log(changes);

    if (changes.length > 1) {
      const historyEntry = new History({
        itemId: user._id,
        itemType: "user",
        userId: req.user._id,
        changes: changes,
      });
      await historyEntry.save();
    }
    return res.json({
      status: "success",
      data: { user },
      message: messages.info.userSaved,
    });
  } catch (e) {
    return next(e);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findOneAndDelete({
      _id: req.params.id,
    });
    if (!user) throw new Error(messages.errors.noUser);
    res.json({
      status: "success",
      data: { user },
      message: messages.info.userDeleted,
    });
  } catch (e) {
    return next(e);
  }
};

router.get(
  "/login/google",
  maintenanceMode,
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/login/facebook",
  maintenanceMode,
  passport.authenticate("facebook", {
    scope: ["public_profile", "email"],
  })
);

router.get("/logout", (req, res, next) => {
  req.logout(() => res.json({ status: "success" }));
});

router.post("/login", login("local"));
router.get(process.env.GOOGLE_OAUTH_CALLBACK, maintenanceMode, login("google"));
router.get(
  process.env.FACEBOOK_OAUTH_CALLBACK,
  maintenanceMode,
  login("facebook")
);

router.post("/user/register", maintenanceMode, createUser);
router.get("/user/profile", auth, getActiveUser);
router.post("/user/create", authAdmin, createUser);
router.post("/user/reset-password", maintenanceMode, sendPasswordToken);
router.post("/user/:id/update", authAdmin, checkMongoId, updateUser);
router.get("/user/:id/delete", authAdmin, checkMongoId, deleteUser);
router.post("/user/:id/password/:token", checkMongoId, createPassword);

module.exports = router;
