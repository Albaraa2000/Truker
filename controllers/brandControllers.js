const brandModel = require("../models/brandModel.js");
const slugify = require("slugify");
const catchAsync = require("./../utils/catchAsync");
const appError = require("./../utils/appError");

// to add a new brand
exports.createBrand = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  let brand = new brandModel({
    name,
    slug: slugify(name),
  });
  await brand.save();
  !brand && next(new appError(" not create brand", 400));
  brand && res.status(200).json(brand);
});
// to get all Brands

exports.getBrands = catchAsync(async (req, res, next) => {
  let brands = await brandModel.find({});
  !brands && next(new appError("category not found", 400));
  brands && res.status(200).json(brands);
});
// to get specific brand

exports.getBrand = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let brand = await brandModel.findById(id);
  !brand && next(new appError("category not found", 400));
  brand && res.status(200).json(brand);
});

// to update specific brand
exports.updateBrand = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  let brand = await brandModel.findByIdAndUpdate(
    id,
    {
      name,
      slug: slugify(name),
    },
    { new: true }
  );
  !brand && next(new appError("category not found", 400));
  brand && res.status(200).json(brand);
});
// to delete specific brand

exports.deleteBrand = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let brand = await brandModel.findByIdAndDelete(id);
  !brand && next(new appError("category not found", 400));
  brand && res.status(200).json(brand);
});
