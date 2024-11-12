const strings = require("../config/strings");

const auth = (req, res, next) => {
  if (!req.user) {
    throw new Error(strings.ERR_NOT_LOGGED);
  }
  return next();
};

const authAdmin = (req, res, next) => {
  // users can delete their own profile
  if (req.route.path == "/user/:id/delete" && req.params.id == req.user.id)
    return next();

  // users can edit their own profile except for the role
  if (
    req.route.path == "/user/:id/update" &&
    req.params.id == req.user.id &&
    req.user.role == req.body.role
  )
    return next();
  else if (req.user.role != "admin") {
    throw new Error(strings.ERR_UNAUTHORIZED);
  }

  next();
};

module.exports = { auth, authAdmin };
