const express = require("express");
const router = express.Router();
const passport = require("passport");

const { AppError } = require("./../lib/errorHandler");
const { mailer } = require("./../lib/mailer");
const User = require("./../config/db").mongoose.model("user");

const { auth, authAdmin } = require("./../lib/authGuards");

const login = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError("no-user"));
  if (!user.password) return next(new AppError("unverified-user"));
  else
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      req.login(user, (err) => {
        if (err) return next(err);
        res.json({ status: "success", data: user });
      });
    })(req, res, next);
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
    let user = await User.findOne({ _id: req.params.id });
    if (!user) return next(new AppError("no-user"));
    else
      res.json({
        status: "success",
        data: { user },
      });
  } catch (e) {
    return next(e);
  }
};

// const getActiveUser = async (req, res) => {
//   res.json({ status: "success", data: { user: req.user } });
// };

const sendPasswordToken = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(new AppError("no-user"));
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
        data: { token },
        message: "A reset link was sent by email.",
      });
    }
  } catch (e) {
    return next(e);
  }
};

const createPassword = async (req, res, next) => {
  try {
    let user = await User.findOne({ _id: req.params.id });
    if (!user) return next(new AppError("no-user"));
    else if (user.verifyToken(req.params.token)) {
      user.password = req.body.password;
      user.verified = true;
      await user.save();
      return res.json({
        status: "success",
        data: { user },
        message: "Password was saved.",
      });
    }
  } catch (e) {
    return next(e);
  }
};

const createUser = async (req, res, next) => {
  try {
    let user;
    user = await User.findOne({ email: req.body.email });
    if (user) return next(new AppError("existing-user"));
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
      message: "A confirmation link was sent by email.",
    });
  } catch (e) {
    return next(e);
  }
};

router.post("/login", login);
router.get("/user/list", auth, authAdmin, getUserList);
// router.get("/user/profile", auth, getActiveUser);
router.post("/user/create", auth, authAdmin, createUser);
router.post("/user/register", createUser);
router.post("/user/reset-password", sendPasswordToken);
router.get("/user/:id", getUser);
router.post("/user/:id/password/:token", createPassword);
router.get("/logout", (req, res, next) => {
  req.logout(() => res.json({ status: "success" }));
});

module.exports = router;
