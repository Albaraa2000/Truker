const subCategoryModel = require("../models/subcategoryModel.js");

const slugify = require("slugify");
const catchAsync = require("./../utils/catchAsync");
const appError = require("./../utils/appError");
const cloudinary = require("../utils/cloudinary");

// to add a new subcategory
exports.createSubCategory = catchAsync(async (req, res, next) => {
  const result = await cloudinary.uploader.upload(req.file.path, {
    tags: "SubCategory",
    folder: "tools/",
  });
  image = result.secure_url;

  const { name, category } = req.body;
  let subcategory = new subCategoryModel({
    name,
    image,
    slug: slugify(name),
    category,
  });
  await subcategory.save();
  !subcategory && next(new appError("category not found", 400));
  subcategory && res.status(200).json(subcategory);
});
// to get all subcategories

exports.getSubCategories = catchAsync(async (req, res, next) => {
  let page = req.query.page * 1 || 1;
  if (page < 0) page = 1;
  let limit = 5;
  let skip = (page - 1) * limit;
  let filter = {};
  if (req.params.categoryId) {
    filter = { category: req.params.categoryId };
  }
  let subcategories = await subCategoryModel
    .find(filter)
    .skip(skip)
    .limit(limit);
  !subcategories && next(new appError("category not found", 400));
  subcategories && res.status(200).json(subcategories);
});
// to get specific subcategory

exports.getSubCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let subcategory = await subCategoryModel.findById(id);
  !subcategory && next(new appError("category not found", 400));
  subcategory && res.status(200).json(subcategory);
});

// to update specific subcategory
exports.updateSubCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name, category } = req.body;
  let subcategory = await subCategoryModel.findByIdAndUpdate(
    id,
    {
      name,
      slug: slugify(name),
      category,
    },
    { new: true }
  );
  !subcategory && next(new appError("category not found", 400));
  subcategory && res.status(200).json(subcategory);
});
// to delete specific subcategory

exports.deleteSubCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let subcategory = await subCategoryModel.findByIdAndDelete(id);
  !subcategory && next(new appError("category not found", 400));
  subcategory && res.status(200).json(subcategory);
});
