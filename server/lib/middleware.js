const messages = require("../config/messages");

const errorHandler = (err, req, res, next) => {
  // error message for mongoose validation errors
  if (err.name == "ValidationError") err.message = messages.errors.default;

  return res
    .status(400)
    .json({
      status: "error",
      message: err.message,
      error: err,
    })
    .send();
};

const checkMongoId = (req, res, next) => {
  if (!/^[0-9a-fA-F]{24}$/.test(req.params.id))
    throw new Error(messages.errors.noItem);
  else return next();
};

const auth = (req, res, next) => {
  if (!req.user) throw new Error(messages.errors.notLogged);
  return next();
};

const authAdmin = (req, res, next) => {
  if (!req.user) throw new Error(messages.errors.notLogged);

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
    throw new Error(messages.errors.unauthorized);
  }

  next();
};

const checkSubscription = async (req, res, next) => {
  try {
    if (req.user.role === "admin") return next();

    const plans = require("../config/plans");
    const plan = plans[req.user.subscription.type];

    if (!plan) throw new Error(messages.errors.invalidPlan);

    if (
      req.user.subscription.endDate &&
      req.user.subscription.endDate < new Date()
    ) {
      throw new Error(messages.errors.expiredPlan);
    }

    req.subscriptionPlan = plan;
    next();
  } catch (error) {
    next(error);
  }
};

const maintenanceMode = (req, res, next) => {
  if (process.env.MAINTENANCE_MODE === "true")
    throw new Error(messages.errors.maintenanceMode);
  return next();
};

module.exports = {
  auth,
  authAdmin,
  errorHandler,
  checkMongoId,
  maintenanceMode,
  checkSubscription,
};
