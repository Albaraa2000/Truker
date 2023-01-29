const equipments = require("../models/equipmentsModel");
const catchAsync = require(`${__dirname}/../utils/catchAsync.js`);

exports.createEquipments = catchAsync(async (req, res, next) => {
  const newEquipment = await equipments.create({
    title: req.body.title,
    description: req.body.description,
    photo: req.body.photo,
    price: req.body.price,
    rating: req.body.rating,
  });
  res.status(201).json({
    status: "success",
    data: {
      Equipment: newEquipment,
    },
  });
});
exports.getAllequipments = catchAsync(async (req, res, next) => {
  const equipment = await equipments.find();
  res.status(200).json({
    status: "succes",
    results: equipment.length,
    data: {
      equipment,
    },
  });
});
exports.getEquipment = catchAsync(async (req, res, next) => {
  const equipment = await equipments.findById(req.params.id);
  res.status(200).json({
    status: "success",
    equipment
  })})
