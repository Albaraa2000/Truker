const Booking = require("../models/bookingModel.js");
const User = require("../models/customerModel");

const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const otpGenerator = require("otp-generator");

const generateCode = function () {
  const secret = otpGenerator.generate(6, {
    digits: true,
    alphabets: false,
    upperCase: false,
    specialChars: false,
  });
  return secret;
};

exports.bookTicket = catchAsync(async (req, res, next) => {
  const service_provider = await User.findById(req.query.userId);

  if (service_provider.available === false) {
    return next(new appError("driver is not available now", 404));
  } else {
    const ticket = await Booking.create({
      service_providerId: req.query.userId,
      truckId: req.query.truckId,
      companyId: req.user._id,
      price: req.body.price,
      description: req.body.description,
      startLocation: { coordinates: req.body.startLocation },
      deliveryLocation: { coordinates: req.body.deliveryLocation },
    });

    service_provider.currentTransactions.push(ticket);
    await service_provider.save({ validateBeforeSave: false });

    await User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: { currentTransactions: ticket },
      },
      {
        new: true,
      }
    );
    res.status(201).json({
      status: "success",
      ticket,
    });
  }
});
exports.confirmTicket = catchAsync(async (req, res, next) => {

  const service_provider = req.user;
  const ticket = await Booking.findById(req.query.ticket)
  const companyId = ticket.companyId;

  if (req.body.booked === true &&  ticket.booked === false) {
    ticket.booked = true;
    const code = generateCode();
    const company = await User.findById(companyId);
    service_provider.available = false;
    service_provider.acceptedTransactions.push(ticket);
    service_provider.currentTransactions.pop(ticket);
    service_provider.bookCode = code;
    
    company.acceptedTransactions.push(ticket);
    company.currentTransactions.pop(ticket);
    company.bookCode = code;

    await service_provider.save({ validateBeforeSave: false });
    await company.save({ validateBeforeSave: false });
  } else {
    return next(new appError("Invalid booked transaction", 400));
  }
  res.status(201).json({
    success: true,
  });
});
exports.confirmProcess = catchAsync(async (req, res, next) => {});
exports.getAllbooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.find();
  results = booking.length;
  if (results == 0) return next(new appError("there was no equipments", 404));
  res.status(200).json({
    results,
    booking,
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
