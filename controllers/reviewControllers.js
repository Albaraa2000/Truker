const reviewModel = require("../models/reviewsModel.js");
const catchAsync = require("./../utils/catchAsync");
const appError = require("./../utils/appError");

// const asyncHandler = require("express-async-handler");

// to add a new review
exports.createReview = catchAsync(async (req, res, next) => {
  const isReview = await reviewModel.findOne({
    customerId: req.user._id,
    truck: req.body.truck,
  });
  if (isReview) {
    next(new appError("you created review before", 400));
  } else {
    const service_provider = await User.findById(req.query.userId);
    let review = new reviewModel(req.body);
    review.customerId = req.user._id;
    review.service_providerId = service_provider._id;
    await review.save();
    !review && next(new appError(" not create review", 400));
    review && res.status(200).json(review);
  }
});
// to get all reviews

exports.getReviews = catchAsync(async (req, res, next) => {
  let reviews = await reviewModel.find({});
  !reviews && next(new appError("review not found", 400));
  reviews && res.status(200).json(reviews);
});
// to get specific review

exports.getReview = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let review = await reviewModel.findById(id);
  !review && next(new appError("review not found", 400));
  review && res.status(200).json(review);
});

// to update specific review
exports.updateReview = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const isReview = await reviewModel.findById(id);
  if (isReview.user._id.toString() == req.user._id.toString()) {
    let review = await reviewModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    !review && next(new appError("review not found", 400));
    review && res.status(200).json(review);
  } else {
    next(new appError("you are not the user for this rev", 400));
  }
});
// to delete specific review

exports.deleteReview = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let review = await reviewModel.findByIdAndDelete(id);
  !review && next(new appError("review not found", 400));
  review && res.status(200).json(review);
});
