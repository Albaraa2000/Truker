const CategoryModel = require("../models/categoryModel.js");

const slugify = require("slugify");
const catchAsync = require("./../utils/catchAsync");

const appError = require("./../utils/appError");
const cloudinary = require("../utils/cloudinary");

// to add a new category
exports.createCategory = catchAsync(async (req, res, next) => {
  const result = await cloudinary.uploader.upload(req.file.path, {
    tags: "Category",
    folder: "Category/",
  });
  const { name } = req.body;

  let category = new CategoryModel({
    name,
    image: result.secure_url,
    slug: slugify(name),
  });
  await category.save();
  !category && next(new appError("category not found", 400));
  category && res.status(200).json(category);
});
// to get all categories

exports.getCategories = catchAsync(async (req, res, next) => {
  let categories = await CategoryModel.find({});
  !categories && next(new appError("category not found", 400));
  categories && res.status(200).json(categories);
});
// to get specific category

exports.getCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let category = await CategoryModel.findById(id);
  !category && next(new appError("category not found", 400));
  category && res.status(200).json(category);
});

// to update specific category
exports.updateCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  let category = await CategoryModel.findByIdAndUpdate(
    id,
    {
      name,
      slug: slugify(name),
    },
    { new: true }
  );
  !category && next(new appError("category not found", 400));
  category && res.status(200).json(category);
});
// to delete specific category

exports.deleteCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  let category = await CategoryModel.findByIdAndDelete(id);
  !category && next(new appError("category not found", 400));
  category && res.status(200).json(category);
});
