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

class AppError extends Error {
  constructor(code) {
    super(code);
    this.code = code;
    this.name = this.constructor.name;

    switch (this.code) {
      case "invalid-token":
        this.message = "Invalid user token.";
        break;
      case "not-logged":
        this.message = "Not logged in.";
        break;
      case "not-authorized":
        this.message = "Unauthorized user.";
        break;
      case "wrong-credentials":
        this.message = "Wrong credentials.";
        break;
      case "unverified-user":
        this.message = "Unverified user.";
        break;
      case "existing-user":
        this.message = "User already exists.";
        break;
      case "no-user":
        this.message = "User not found.";
        break;
      case "google-user":
        this.message =
          "This email is already registered via a Google account. Please login with Google.";
        break;
      case "existing-equipment":
        this.message = "Equipment already exists.";
        break;
      case "no-equipment":
        this.message = "Equipment not found.";
        break;
      case "no-ticket":
        this.message = "Ticket not found.";
        break;
      case "no-item":
        this.message = "Item not found.";
        break;
      default:
        this.message = "Unknown error code.";
    }
  }
}

module.exports = { errorHandler, AppError };
