const equipments = require("../models/equipmentsModel");
const APIFeatures = require(`${__dirname}/../utils/apiFeaturs`);
const catchAsync = require(`${__dirname}/../utils/catchAsync.js`);
const AppError = require(`${__dirname}/../utils/appError.js`);

const cloudinary = require("./cloudinary");

exports.createEquipments = catchAsync(async (req, res, next) => {
  // Use Cloudinary SDK to upload the image

  const result = await cloudinary.uploader.upload(req.file.path, {
    tags: "equipments",
    folder: "tools/",
  });
  const newEquipment = await equipments.create({
    title: req.body.title,
    description: req.body.description,
    photo: result.secure_url,
    price: req.body.price,
    category: req.body.category,
    type: req.body.type,
    userId: req.user._id,
  });

  res.status(201).json({
    status: "success",
    newEquipment,
  });
});

exports.getAllequipments = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(equipments, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const equipment = await features.query;
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
exports.deleteEquipment = catchAsync(async (req, res, next) => {
  const oneEquipment = await equipments.findById(req.params.id);
  if (!oneEquipment)
    return next(
      new AppError(`there is no equipment with id ${req.params.id}`, 404)
    );
  if (req.user._id != oneEquipment.userId) {
    return next(
      new AppError(`You are not authorized to delete this item`, 403)
    );
  }
  const deletedEquipment = await equipments.findByIdAndDelete(req.params.id);

  res.status(204).json({
    Message: "delete successfully",
  });
});
exports.updateEquipment = catchAsync(async (req, res, next) => {
  const Equipment = await equipments.findById(req.params.id);
  if (!Equipment)
    return next(
      new AppError(`there is no equipment with id ${req.params.id}`, 404)
    );
  if (req.user._id != Equipment.userId) {
    return next(
      new AppError(`You are not authorized to update this item`, 403)
    );
  }
  const updatedEquipment = await equipments.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    Equipment,
  });
});
