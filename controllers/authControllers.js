const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/customerModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const sendEmail = require("./../utils/email");
const crypto = require("crypto");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    status: "success",
    token,
    user,
  });
};
const sendOtp = async (user) => {
  user.otp = user.createOTP();
  await user.save({ validateBeforeSave: false });
  const message = `Your otp is ${user.otp} valid for 10 minutes`;
  try {
    await sendEmail({
      email: user.email,
      subject: `otp`,
      message,
    });
  } catch (err) {
    console.log(err);
  }
};
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
    // location: { coordinates: req.body.location },
  });
  sendOtp(newUser);
  createSendToken(newUser, 201, res);
});

module.exports.verfiy = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const otpCode = req.body.otpCode;
  if (user.otpExpires > Date.now()) {
    if (user.otp === otpCode) {
      user.otp = undefined;
      user.otpExpires=undefined;
      user.verified = true;
      await user.save({ validateBeforeSave: false });
      res.status(200).json({
        message: "verfied",
      });
    } else {
      return next(new AppError("verfication failed"), 404);
    }
  } else {
    return next(
      new AppError(
        "Your otp code has expired, please log in again to have new OTP"
      ),
      400
    );
  }
});
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400)); //400
  }
  // // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    // instance method
    return next(new AppError("Incorrect email or password", 401)); //401
  }

  //  3) If everything ok, send token to client
  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    message: "Signed in successfully",
    id: user._id,
    token,
    user
  });
});
exports.sendOtpAgain = catchAsync(async (req, res, next) => {
  if (req.user.verified != true) {
    sendOtp(req.user);
    res.status(200).json({
      status: "success",
      message: "otp sent to your mail",
    });
  } else {
    return next(new AppError("account is activated already", 200));
  }
});

exports.protect = catchAsync(async (req, res, next) => {
  //1 get token and check if it exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new AppError("You are not authorized to access this page", 401)
    );
  }
  //2 Verfication Token =====> if someone manipulate the data or token expired
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decoded);
  //3 check if user still exist
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError("user has been deleted", 401));
  }
  // check if user changed password
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("user changed password please, log in again", 401)
    );
  }
  // get access to next requset
  req.user = currentUser;
  next();
});
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("you dont have permission to do that", 403));
    }
    next();
  };
};
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with email address.", 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  // const resetURL = `${req.protocol}://${req.get(
  //   "host"
  // )}/api/v1/users/resetPassword/${resetToken}`;
  const resetURL = `https://gradreact.pildextech.cf/ar/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message: message,
    });

    res.status(200).json({
      status: "success",
      message: "If you provided a valid email, message sent to your mail",
    });
  } catch (err) {
    console.log(err);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError("There was an error sending the email. Try again later!"),
      500
    );
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Token has expired"), 400);
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createSendToken(user, 200, res);
});
exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.user.email }).select(
    "+password"
  );
  console.log(user);
  if (!(await user.correctPassword(req.body.oldPassword, user.password))) {
    return next(new AppError("Your Cuurent Password is wrong", 401)); //401
  }

  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.newPasswordConfirm;
  await user.save();

  createSendToken(user, 200, res);
});
