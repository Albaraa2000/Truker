const Booking = require("../models/bookingModel.js");
const User = require("../models/customerModel");

const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");

exports.bookTicket = catchAsync(async (req, res, next) => {
  const ticket = await Booking.create({
    driverId: req.truck.userId,
    truckId: req.truck.id,
    companyId: req.user._id,
    price: req.body.price,
    startLocation: { coordinates: req.body.startLocation },
    deliveryLocation: { coordinates: req.body.deliveryLocation },
  });

  await User.findByIdAndUpdate(
    req.truck.userId,
    {
      $addToSet: { transactions: ticket },
    },
    {
      new: true,
    }
  );
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { transactions: ticket },
    },
    {
      new: true,
    }
  );
  res.status(201).json({
    status: "success",
    ticket,
  });
});

exports.getAllbooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.find();
  results = booking.length;
  if (results == 0) return next(new appError("there was no equipments", 404));
  res.status(200).json({
    results,
    booking
  });
});
// exports.getEquipment = catchAsync(async (req, res, next) => {
//   const oneEquipment = await equipments.findById(req.params.id);

//   if (!oneEquipment)
//     return next(
//       new AppError(`there is no equipment with id ${req.params.id}`, 404)
//     );

//   res.status(200).json({
//     oneEquipment,
//   });
// });
// exports.deleteEquipment = catchAsync(async (req, res, next) => {
//   const oneEquipment = await equipments.findById(req.params.id);
//   if (!oneEquipment)
//     return next(
//       new AppError(`there is no equipment with id ${req.params.id}`, 404)
//     );
//   if (req.user._id != oneEquipment.userId) {
//     return next(
//       new AppError(`You are not authorized to delete this item`, 403)
//     );
//   }
//   const deletedEquipment = await equipments.findByIdAndDelete(req.params.id);

//   res.status(204).json({
//     Message: "delete successfully",
//   });
// });
// exports.updateEquipment = catchAsync(async (req, res, next) => {
//   const Equipment = await equipments.findById(req.params.id);
//   if (!Equipment)
//     return next(
//       new AppError(`there is no equipment with id ${req.params.id}`, 404)
//     );
//   if (req.user._id != Equipment.userId) {
//     return next(
//       new AppError(`You are not authorized to update this item`, 403)
//     );
//   }
//   const updatedEquipment = await equipments.findByIdAndUpdate(
//     req.params.id,
//     req.body,
//     {
//       new: true,
//       runValidators: true,
//     }
//   );

//   res.status(200).json({
//     Equipment,
//   });
// });
// // exports.saveLocation = catchAsync(async (req, res, next) => {
// //   const { location } = req.body;

// //   // Find the equipment document by user ID and update its location field
// //   const equipment = await equipments.findOneAndUpdate(
// //     { userId: "64034544841715002e86fdf1" },
// //     { location: { coordinates: location } },
// //     { new: true }
// //   );

// //   res.status(200).json({ success: true, equipment });
// // });
