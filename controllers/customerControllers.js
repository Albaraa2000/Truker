const User = require("../models/customerModel");
const catchAsync = require(`${__dirname}/../utils/catchAsync.js`);
const AppError = require(`${__dirname}/../utils/appError.js`);

const filterObj = (obj, ...allowed) => {
  const newObj = {};
  Object.keys(allowed).forEach((el) => {
    if (allowed.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};
exports.getAllusers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  if (!users)
    return next(new AppError(`there is no user with id ${req.params.id}`, 404));
  res.status(200).json({
    users,
  });
});
exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user)
    return next(new AppError(`there is no user with id ${req.params.id}`, 404));
  res.status(200).json({
    user,
  });
});
exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError(`this route is not for password update !!!`, 404));
  }
  const filterBody = filterObj(req.body, "name", "email");
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "succes",
    updatedUser
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: "succes",
    message: "not Yet Implemented",
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: "succes",
    message: "not Yet Implemented",
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: "succes",
    message: "not Yet Implemented",
  });
};
