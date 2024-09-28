const express = require("express");
const router = express.Router();
const passport = require("passport");

const { AppError } = require("./../lib/errorHandler");
const { mailer } = require("./../lib/mailer");
const User = require("./../config/db").mongoose.model("user");

// const { auth, authAdmin } = require("./../lib/authGuards");

const login = (req, res, next) => {
  return (req, res, next) => {
    if (!req.body.email || !req.body.password)
      next(new AppError("wrong-credentials"));
    else
      passport.authenticate("local", (err, user, info) => {
        if (err) {
          console.log("error during server login");

          return next(err);
        }
        req.login(user, (err) => {
          if (err) return next(err);
          res.json({ status: "success", data: user });
        });
      })(req, res, next);
  };
};

// const getActiveUser = async (req, res) => {
//   res.json({ status: "success", data: { user: req.user } });
// };

const sendPasswordToken = async (req, res, next) => {
  try {
    console.log(req.body);

    const user = await User.findOne({ email: req.body.email });
    if (!user) next(new AppError("no-user"));
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
    if (!user) next(new AppError("no-user"));
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
    if (user) next(new AppError("existing-item"));
    user = new User({
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
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

router.post("/login", login());
router.get("/logout", (req, res, next) => {
  req.logout(() => res.json({ status: "success" }));
});
// router.get("/user/profile", auth, getActiveUser);
router.post("/user/create", createUser);
router.post("/user/reset-password", sendPasswordToken);
router.post("/user/:id/password/:token", createPassword);

module.exports = router;
