const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const messages = require("../config/messages");

const UserSchema = new mongoose.Schema(
  {
    googleId: String,
    facebookId: String,
    lastConnected: Date,
    verified: {
      type: Boolean,
      required: true,
      default: false,
    },
    email: {
      type: String,
      required: true,
      index: true,
      trim: true,
      unique: true,
      validate: validator.isEmail,
    },
    password: {
      type: String,
      minlength: 6,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    subscription: {
      type: {
        type: String,
        enum: ["free", "paid"],
        default: "free",
      },
      startDate: {
        type: Date,
        default: Date.now,
      },
      endDate: {
        type: Date,
      },
      autoRenew: {
        type: Boolean,
        default: true,
      },
      stripeSubscriptionId: String,
      stripeCustomerId: String,
    },
  },
  { timestamps: { createdAt: "added", updatedAt: "updated" } }
);

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  return userObject;
};

UserSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.generateToken = function (duration) {
  const expiresIn = duration ? duration : "1d";
  const secret = process.env.JWT_SECRET + this._id;
  return jwt.sign({ id: this._id }, secret, { expiresIn }).toString();
};

UserSchema.methods.verifyToken = function (token) {
  const secret = process.env.JWT_SECRET + this._id;
  try {
    return jwt.verify(token, secret);
  } catch (e) {
    throw new Error(messages.errors.invalidToken);
  }
};

UserSchema.methods.updateLastConnected = async function () {
  try {
    const updatedUser = await this.constructor.findOneAndUpdate(
      { _id: this._id },
      { $set: { lastConnected: Date.now() } },
      { new: true }
    );
    
    if (!updatedUser) {
      throw new Error('Failed to update last connected time');
    }
    this.lastConnected = updatedUser.lastConnected;
  } catch (error) {
    console.error('Error updating last connected:', error);
    throw error;
  }
};

UserSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    bcrypt.genSalt(12, (err, salt) => {
      if (err) return next(err);
      bcrypt.hash(this.password, salt, (err, hash) => {
        if (err) return next(err);
        this.password = hash;
        return next();
      });
    });
  } else return next();
});

mongoose.model("user", UserSchema);
