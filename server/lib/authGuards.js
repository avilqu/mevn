const { AppError } = require("./../lib/errorHandler");

const auth = (req, res, next) => {
  if (!req.user) {
    return next(new AppError("not-logged"));
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
    return next(new AppError("not-logged"));
  } else if (req.user.role != "admin") {
    return next(new AppError("not-authorized"));
  }

  next();
};

module.exports = { auth, authAdmin };
