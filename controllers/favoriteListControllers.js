const userModel = require("../models/userModel.js");

const catchAsync = require("./../utils/catchAsync");

const appError = require("./../utils/appError");
// const asyncHandler = require("express-async-handler");
// add to
exports.addToFavoriteList = catchAsync(async (req, res, next) => {
  let { favoriteList } = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { favoriteList: req.body.truck },
    },
    {
      new: true,
    }
  );
  !favoriteList && next(new appError("favorite List not found", 400));
  favoriteList && res.status(200).json(favoriteList);
});
// get favorite trucks for user
exports.getUserFavoriteList = catchAsync(async (req, res, next) => {
  let { favoriteList } = await userModel.findById(req.user._id);
  !favoriteList && next(new appError("favorite List not found", 400));
  favoriteList && res.status(200).json(favoriteList);
});
// delete
exports.removeFromFavoriteList = catchAsync(async (req, res, next) => {
  let { favoriteList } = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { favoriteList: req.body.truck },
    },
    {
      new: true,
    }
  );
  !favoriteList && next(new appError("favorite List not found", 400));
  favoriteList && res.status(200).json(favoriteList);
});
