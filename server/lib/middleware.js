const errorHandler = (err, req, res, next) => {
  // error message for mongoose validation errors
  if (err.name == "ValidationError") err.message = process.env.ERR_DEFAULT;

  return res
    .json({
      status: "error",
      message: err.message,
      error: err,
    })
    .send();
};

const checkMongoId = (req, res, next) => {
  if (!/^[0-9a-fA-F]{24}$/.test(req.params.id))
    throw new Error(process.env.ERR_NO_USER);
  else return next();
};

const auth = (req, res, next) => {
  if (!req.user) throw new Error(process.env.ERR_NOT_LOGGED);
  return next();
};

const authAdmin = (req, res, next) => {
  if (!req.user) throw new Error(process.env.ERR_NOT_LOGGED);

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
    throw new Error(process.env.ERR_UNAUTHORIZED);
  }

  next();
};

module.exports = { auth, authAdmin, errorHandler, checkMongoId };
