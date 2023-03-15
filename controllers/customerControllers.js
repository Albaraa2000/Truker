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
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data

  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError(`this route is not for password update !!!`, 404));
  }
  // 2) Filtered out unwanted fields names that are not allowed to be updated

  const filterBody = filterObj(req.body, "name", "email");
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "succes",
    updatedUser,
  });
});
exports.deleteMe = catchAsync(async (req, res, next) => {
  const deleteUser = await User.findByIdAndUpdate(req.user.id, {
    active: false,
  });
  res.status(204).json({
    status: "succes",
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
