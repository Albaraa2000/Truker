const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");


const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    avatar: req.body.avatar,
    role: req.body.role
  });
  const token = signToken(newUser._id);
  res.status(201).json({
    status: "success",
    token,
    newUser,
  });
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

  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    message: "Signed in successfully",
    id: user._id,
    token,
  });

  // // 3) If everything ok, send token to client
  // createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {

  //1 get token and check if it exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('You are not authorized to access this page', 401)
    );
  }
  //2 Verfication Token =====> if someone manipulate the data or token expired
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decoded);
  //3 check if user still exist
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('user has been deleted', 401));
  }
  // check if user changed password
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('user changed password please, log in again', 401)
    );
  }
  // get access to next
  req.user = currentUser;
  // console.log(req.user)
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






