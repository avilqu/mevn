const express = require("express");
const router = express.Router();
const passport = require("passport");

const { AppError } = require("./../lib/errorHandler");
const { mailer } = require("./../lib/mailer");
const User = require("./../config/db").mongoose.model("user");

const { auth, authAdmin } = require("./../lib/authGuards");

const login = (strategy) => {
  return (req, res, next) => {
    passport.authenticate(
      strategy,
      { failureRedirect: "/login" },
      (err, user) => {
        if (err) {
          return next(err);
        }
        req.login(user, (err) => {
          if (err) return next(err);
          else if (strategy == "local")
            res.json({ status: "success", data: { user } });
          else {
            res.redirect("http://localhost:8080/?auth");
          }
        });
      }
    )(req, res, next);
  };
};

// const login = async (req, res, next) => {
//   const user = await User.findOne({ email: req.body.email });
//   if (!user) return next(new AppError("wrong-credentials"));
//   if (!user.password) return next(new AppError("unverified-user"));
//   else
//     passport.authenticate("local", (err, user, info) => {
//       if (err) return next(err);
//       req.login(user, (err) => {
//         if (err) return next(err);
//         res.json({ status: "success", data: user });
//         user.updateLastConnected();
//       });
//     })(req, res, next);
// };

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

const getActiveUser = async (req, res) => {
  res.json({ status: "success", data: { user: req.user } });
};

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

const updateUser = async (req, res, next) => {
  try {
    let user = await User.findOne({ _id: req.params.id });
    if (!user) return next(new AppError("no-user"));
    if (req.params.id != req.user.id && req.user.role != "admin")
      return next(new AppError("not-authorized"));
    if (req.user.role != req.body.role && req.user.role != "admin")
      return next(new AppError("not-authorized"));
    await user.updateOne(req.body);
    return res.json({
      status: "success",
      data: { user },
      message: "User was saved.",
    });
  } catch (e) {
    return next(e);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    let user = await User.findOneAndDelete({
      _id: req.params.id,
    });
    if (!user) next(new AppError("no-user"));
    res.json({
      status: "success",
      data: { user },
      message: "User was deleted.",
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

router.post("/login", login("local"));
router.get("/login/google/callback", login("google"));

router.post("/user/register", createUser);
router.get("/user/profile", auth, getActiveUser);
router.post("/user/create", authAdmin, createUser);
router.post("/user/reset-password", sendPasswordToken);
router.get("/user/list", authAdmin, getUserList);
router.get("/user/:id", authAdmin, getUser);
router.post("/user/:id/update", authAdmin, updateUser);
router.get("/user/:id/delete", authAdmin, deleteUser);
router.post("/user/:id/password/:token", createPassword);
router.get("/logout", (req, res, next) => {
  req.logout(() => res.json({ status: "success" }));
});

module.exports = router;
