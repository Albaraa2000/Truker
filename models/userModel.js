const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please tell us your name"],
  },
  email: {
    type: String,
    required: [true, "please tell us your email address"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  phone: {
    type: String,
    required: [true, "please tell us your phone number"],
    unique: true,
    validate: {
      validator: function (v) {
        return validator.isMobilePhone(v, "ar-EG");
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  password: {
    type: String,
    required: [true, "Please provide a valid password"],
    validate: [validator.isStrongPassword, "Please provide Strong Password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords do not match",
    },
  },
  avatar: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    enum: ["service_provider", "customer"],
    default: "customer",
  },
  verified: {
    type: Boolean,
    default: false,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  nationalId: {
    type: String,
    default: null,
  },
  available: {
    type: Boolean,
    default: true,
  },

  favoriteList: [{ type: mongoose.Types.ObjectId, ref: "truck" }],
  doneTransactions: [{ type: mongoose.Types.ObjectId, ref: "booking" }],
  currentTransactions: [{ type: mongoose.Types.ObjectId, ref: "booking" }],
  acceptedTransactions: [{ type: mongoose.Types.ObjectId, ref: "booking" }],
  reviews: [{ type: mongoose.Types.ObjectId, ref: "review" }],
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  // to encrypt the password
  this.password = await bcrypt.hash(this.password, 12);
  // to delete the password confirmation from the database
  this.passwordConfirm = undefined;
  next();
});
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1;

  next();
});
// instance ====> method available in all documents
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  //JWTTimestamp is when the token is issued
  //this refere to current document
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    // console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }
  //false means that password not changed
  return false;
};
userSchema.methods.createOTP = function () {
  const secret = Math.floor(100000 + Math.random() * 900000);
  this.otpExpires = Date.now() + 10 * 60 * 1000;
  return secret;
};
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  // console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
const User = new mongoose.model("User", userSchema);

module.exports = User;
