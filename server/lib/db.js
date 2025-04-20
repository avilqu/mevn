const messages = require("../config/messages");

const createItem = async (req, res, next) => {
  try {
    const item = new req.Item(req.body);
    item.creatorId = req.user._id;
    await item.save();
  } catch (e) {
    return next(e);
  }
};

const deleteItem = (req, res, next) => {
  return next();
};

const updateItem = (req, res, next) => {
  return next();
};

const getItem = (req, res, next) => {
  return next();
};

const getItemList = (req, res, next) => {
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
};
