const equipments= require('../models/equipmentsModel');
const catchAsync = require(`${__dirname}/../utils/catchAsync.js`);

exports.createEquipments = catchAsync(async (req, res, next) => {
  const newEquipment = await equipments.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      Equipment: newEquipment,
    },
  });
});
exports.getAllequipments =  catchAsync( async(req, res,next) => {
  const equipment = await equipments.find();
  res.status(200).json({
    status: 'succes',
    results: equipment.length,
    data: {
      equipment,
    },
  });
});