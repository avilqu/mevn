const errorHandler = (err, req, res, next) => {
  // Define error message for ValidationErrors
  if (err.errors) {
    if (err.errors.password)
      err.message = "Password must be at least 6 characters.";
    if (err.errors.email) err.message = "Email address is invalid.";
    if (err.errors.name) err.message = "Name is needed.";
  }

  // Format and send JSON response
  return (
    res
      // .status(statusCode)
      .json({
        status: "error",
        message: err.message,
        error: err,
      })
      .send()
  );
};

module.exports = { errorHandler };
