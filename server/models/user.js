const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const strings = require("../config/strings");

const UserSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      // index: {
      //   unique: true,
      //   partialFilterExpression: {
      //     googleId: {
      //       $type: "string",
      //     },
      //   },
      // },
    },
    facebookId: {
      type: String,
      // index: {
      //   unique: true,
      //   partialFilterExpression: {
      //     facebookId: {
      //       $type: "string",
      //     },
      //   },
      // },
    },
    appleId: {
      type: String,
      // index: {
      //   unique: true,
      //   partialFilterExpression: {
      //     facebookId: {
      //       $type: "string",
      //     },
      //   },
      // },
    },
    verified: {
      type: Boolean,
      required: true,
      default: true,
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
    lastConnected: {
      type: Date,
      default: Date.now(),
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    pic: {
      type: String,
    },
  },
  { timestamps: { createdAt: "added", updatedAt: "updated" } }
);

UserSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.generateToken = function (duration) {
  const expiresIn = duration ? duration : "1d";
  let secret;
  secret = process.env.JWT_SECRET + this._id;
  return jwt.sign({ id: this._id }, secret, { expiresIn }).toString();
};

UserSchema.methods.verifyToken = function (token) {
  let secret;
  secret = process.env.JWT_SECRET + this._id;
  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (e) {
    throw new Error(strings.ERR_INVALID_TOKEN);
  }
};

UserSchema.methods.updateLastConnected = function () {
  this.lastConnected = Date.now();
  this.save();
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
