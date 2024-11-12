const strings = require("../config/strings");

const auth = (req, res, next) => {
  if (!req.user) {
    return next(new Error(strings.ERR_NOT_LOGGED));
  }
  return next();
};

const authAdmin = (req, res, next) => {
  if (
    (req.route.path == "/user/:id/update" ||
      req.route.path == "/user/:id/delete") &&
    req.params.id == req.user.id
  ) {
    return next();
  } else if (!req.user) {
    return next(new Error(strings.ERR_NOT_LOGGED));
  } else if (req.user.role != "admin") {
    return next(new Error(strings.ERR_UNAUTHORIZED));
  }

  next();
};

module.exports = { auth, authAdmin };
