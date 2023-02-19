const equipments = require("../models/equipmentsModel");
const catchAsync = require(`${__dirname}/../utils/catchAsync.js`);
const AppError = require(`${__dirname}/../utils/appError.js`);

const cloudinary = require('cloudinary').v2;


// Configuration 
cloudinary.config({
  cloud_name: "dnp0llgn2",
  api_key: "794648356647968",
  api_secret: "284gqPXRS4Q3gSF5fimyGwML4v0"
});

exports.createEquipments = catchAsync(async (req, res, next) => {
  let imageUrl;
  if (req.file) {
    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);
    imageUrl = result.secure_url;
  }

  // Create new equipment document
  const newEquipment = await equipments.create({
    title: req.body.title,
    description: req.body.description,
    photo: imageUrl|| req.body.photo  ,
    price: req.body.price,
    rating: req.body.rating,
    favourite: req.body.favourite,
    type: req.body.type
  });

  res.status(201).json({
    status: 'success',
    newEquipment
  });
});


exports.getAllequipments = catchAsync(async (req, res, next) => {
  const equipment = await equipments.find();
  results = equipment.length;
  if (results == 0) return next(new AppError("there was no equipments", 404));
  res.status(200).json({
    results,
    equipment
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
