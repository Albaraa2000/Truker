const couponModel = require("../models/couponModel.js");
const catchAsync = require("./../utils/catchAsync");
const appError = require("./../utils/appError");
// const asyncHandler = require("express-async-handler");

// to add a new coupon
exports.createCoupon = catchAsync(async (req, res, next) => {
  let coupon = new couponModel(req.body);
  await coupon.save();
  !coupon && next(new appError(" not create coupon", 400));
  coupon && res.status(200).json(coupon);
});
// to get all coupons

exports.getCoupons = catchAsync(async (req, res, next) => {
  let coupons = await couponModel.find({});
  !coupons && next(new appError("category not found", 400));
  coupons && res.status(200).json(coupons);
});
// to get specific coupon

exports.getCoupon = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let coupon = await couponModel.findById(id);
  !coupon && next(new appError("category not found", 400));
  coupon && res.status(200).json(coupon);
});

// to update specific coupon
exports.updateCoupon = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let coupon = await couponModel.findByIdAndUpdate(id, req.body, { new: true });
  !coupon && next(new appError("category not found", 400));
  coupon && res.status(200).json(coupon);
});
// to delete specific coupon
exports.deleteCoupon = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let coupon = await couponModel.findByIdAndDelete(id);
  !coupon && next(new appError("category not found", 400));
  coupon && res.status(200).json(coupon);
});
