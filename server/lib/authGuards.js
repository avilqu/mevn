const { AppError } = require("./../lib/errorHandler");

const auth = (req, res, next) => {
  if (!req.user) {
    next(new AppError("not-logged"));
  }
  next();
};

const authAdmin = (req, res, next) => {
  if (req.user.role < 4) {
    next(new AppError("not-authorized"));
  }
  next();
};

module.exports = { auth, authAdmin };
