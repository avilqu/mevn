const express = require("express");
const router = express.Router();
const passport = require("passport");

const { mailer } = require("../lib/mailer");
const User = require("../lib/init").mongoose.model("user");
const { auth, authAdmin, checkMongoId } = require("../lib/middleware");

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
          else res.redirect("http://localhost:8080/?auth");
          user.updateLastConnected();
        });
      }
    )(req, res, next);
  };
};

const getUserList = async (req, res, next) => {
  try {
    const users = await User.find();
    res.json({
      status: "success",
      data: { users },
    });
  } catch (e) {
    return next(e);
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) throw new Error(process.env.ERR_NO_USER);
    else
      res.json({
        status: "success",
        data: { user },
      });
  } catch (e) {
    return next(e);
  }
};

const getActiveUser = async (req, res) => {
  res.json({ status: "success", data: { user: req.user } });
};

const sendPasswordToken = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) throw new Error(process.env.ERR_NO_USER);
    else {
      const token = user.generateToken();
      await mailer.resetPassword({
        email: user.email,
        baseUrl: req.headers.host,
        id: user.id,
        token: token,
      });
      return res.json({
        status: "success",
        message: process.env.INFO_PASSWORD_RESET_LINK,
      });
    }
  } catch (e) {
    return next(e);
  }
};

const createPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) throw new Error(process.env.ERR_NO_USER);
    else if (user.verifyToken(req.params.token)) {
      user.password = req.body.password;
      user.verified = true;
      await user.save();
      return res.json({
        status: "success",
        data: { user },
        message: process.env.INFO_PASSWORD_SAVED,
      });
    }
  } catch (e) {
    return next(e);
  }
};

const createUser = async (req, res, next) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) throw new Error(process.env.ERR_EXISTING_USER);
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
    const token = user.generateToken();
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
      message: process.env.INFO_ACTIVATION_LINK,
    });
  } catch (e) {
    return next(e);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) throw new Error(process.env.ERR_NO_USER);
    await user.updateOne(req.body);
    return res.json({
      status: "success",
      data: { user },
      message: process.env.INFO_USER_SAVED,
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
    if (!user) throw new Error(process.env.ERR_NO_USER);
    res.json({
      status: "success",
      data: { user },
      message: process.env.INFO_USER_DELETED,
    });
  } catch (e) {
    return next(e);
  }
};

router.get(
  "/login/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/login/facebook",
  passport.authenticate("facebook", {
    authType: "reauthenticate",
    scope: ["public_profile", "email"],
  })
);

router.get("/logout", (req, res, next) => {
  req.logout(() => res.json({ status: "success" }));
});

router.post("/login", login("local"));
router.get("/login/google/callback", login("google"));
router.get("/login/facebook/callback", login("facebook"));

router.post("/user/register", createUser);
router.get("/user/profile", auth, getActiveUser);
router.post("/user/create", authAdmin, createUser);
router.post("/user/reset-password", sendPasswordToken);
router.get("/user/list", authAdmin, getUserList);
router.get("/user/:id", authAdmin, checkMongoId, getUser);
router.post("/user/:id/update", authAdmin, checkMongoId, updateUser);
router.get("/user/:id/delete", authAdmin, checkMongoId, deleteUser);
router.post("/user/:id/password/:token", checkMongoId, createPassword);

module.exports = router;
