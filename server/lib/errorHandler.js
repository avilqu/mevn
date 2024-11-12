const strings = require("../config/strings");

const errorHandler = (err, req, res, next) => {
  // error message for mongoose validation errors
  if (err.name == "ValidationError") err.message = strings.ERR_DEFAULT;

  return res
    .json({
      status: "error",
      message: err.message,
      error: err,
    })
    .send();
};

module.exports = { errorHandler };
