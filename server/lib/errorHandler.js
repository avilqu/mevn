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

module.exports = { errorHandler };
