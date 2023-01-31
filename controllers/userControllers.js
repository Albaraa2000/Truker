const User = require("./../models/userModel");
const catchAsync = require(`${__dirname}/../utils/catchAsync.js`);
const AppError = require(`${__dirname}/../utils/appError.js`);

exports.getAllusers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  if(!users) return next(new AppError(`there is no user with id ${req.params.id}`,404));
  res.status(200).json({
    users
  });
});
exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if(!user) return next(new AppError(`there is no user with id ${req.params.id}`,404));
  res.status(200).json({
    user
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
