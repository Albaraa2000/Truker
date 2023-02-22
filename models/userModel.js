const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
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
  image: {
    type: String,
    required: [true, "please provide a valid image"],

  },
  password: {
    type: String,
    required: [true, "Please provide a valid password"],
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
    default:"",
  },
  passwordChangedAt: Date,
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  // to encrypt the password
  this.password = await bcrypt.hash(this.password, 12);
  // to delete the password confirmation from the database
  this.passwordConfirm = undefined;
  next();
});
// instance ====> method available in all documents
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// instance
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  //this refere to current document
  if (this.passwordChangedAt) {
    console.log(this.passwordChangedAt, JWTTimestamp);
  }
  return false;
};
const User = new mongoose.model("User", userSchema);

module.exports = User;
