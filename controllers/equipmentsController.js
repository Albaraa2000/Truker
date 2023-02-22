const equipments = require("../models/equipmentsModel");
const catchAsync = require(`${__dirname}/../utils/catchAsync.js`);
const AppError = require(`${__dirname}/../utils/appError.js`);
const cloudinary = require("./cloudinary");

exports.createEquipments = catchAsync(async (req, res, next) => {
  // Use Cloudinary SDK to upload the image
  const result = await cloudinary.uploader.upload(req.file.path, {
    tags: "equipments",
    folder: "tools/",
    public_id: "tool_id",
  });
  const newEquipment = await equipments.create({
    title: req.body.title,
    description: req.body.description,
    image: result.secure_url,
    price: req.body.price,
    rating: req.body.rating,
    favourite: req.body.favourite,
    type: req.body.type,
  });
  console.log(newEquipment);

  res.status(201).json({
    status: "success",
    newEquipment,
  });
});

exports.getAllequipments = catchAsync(async (req, res, next) => {
  const equipment = await equipments.find();
  results = equipment.length;
  if (results == 0) return next(new AppError("there was no equipments", 404));
  res.status(200).json({
    results,
    equipment,
  });
});
exports.getEquipment = catchAsync(async (req, res, next) => {
  const oneEquipment = await equipments.findById(req.params.id);
  if (!oneEquipment)
    return next(
      new AppError(`there is no equipment with id ${req.params.id}`, 404)
    );
  res.status(200).json({
    oneEquipment,
  });
});
