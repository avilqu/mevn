const messages = {
  errors: {
    default: "Something went wrong.",
    maintenanceMode: "This function is currently disabled.",
    invalidToken: "Invalid token.",
    notLogged: "Not logged in.",
    unauthorized: "Unauthorized.",
    wrongCredentials: "Wrong credentials.",
    unverifiedUser: "Unverified user.",
    existingUser: "User already exists.",
    googleUser:
      "This email is already registered via a Google account. Please login with Google.",
    facebookUser:
      "This email is already registered via a Facebook account. Please login with Facebook.",
    noUser: "User not found.",
    invalidPassword: "Password must be at least 6 characters.",
    invalidEmail: "Email address is invalid.",
    invalidName: "Name is needed.",
    invalidPlan: "Invalid plan.",
    expiredPlan: "Subscription expired.",
    noItem: "Item not found.",
  },
  info: {
    activationLink: "An activation link was sent by email.",
    userActivated: "User is activated. You can now login.",
    passwordResetLink: "A reset link was sent by email.",
    passwordSaved: "Password was saved.",
    userSaved: "User was saved.",
    userDeleted: "User was deleted.",
    itemCreated: "Item was created.",
    itemDeleted: "Item was deleted.",
    itemSaved: "Item was saved.",
    subscriptionCanceled: "Subscription was canceled.",
    subscriptionUpgraded: "Subscription was upgraded.",
  },
};

module.exports = messages;
