module.exports = {
  // error messages
  ERR_INVALID_TOKEN: "Invalid token.",
  ERR_NOT_LOGGED: "Not logged in.",
  ERR_UNAUTHORIZED: "Unauthorized.",
  ERR_WRONG_CREDENTIALS: "Wrong credentials.",
  ERR_UNVERIFIED_USER: "Unverified user.",
  ERR_EXISTING_USER: "User already exists.",
  ERR_GOOGLE_USER:
    "This email is already registered via a Google account. Please login with Google.",
  ERR_NO_USER: "User not found.",
  ERR_INVALID_PASSWORD: "Password must be at least 6 characters.",
  ERR_INVALID_EMAIL: "Email address is invalid.",
  ERR_INVALID_NAME: "Name is needed.",
  ERR_DEFAULT: "Something went wrong.",

  // info messages
  INFO_ACTIVATION_LINK: "An activation link will be sent by email.",
  INFO_USER_ACTIVATED: "User is activated. You can now login.",
  INFO_PASSWORD_RESET_LINK:
    "A reset link will be sent by email if the user is found.",
  INFO_PASSWORD_SAVED: "Password was saved.",
  INFO_USER_SAVED: "User was saved.",
  INFO_USER_DELETED: "User was deleted.",

  // mailer config
  MAILER_NAME: "MEVN app",
  MAILER_NAME_SHORT: "MEVN",
  MAILER_SENDER: "avilqu@gmail.com",
  MAILER_SUBJECT_ACTIVATION: "MEVN | Activate your account",
  MAILER_SUBJECT_PASSWORD_RESET: "MEVN | Reset your password",
};