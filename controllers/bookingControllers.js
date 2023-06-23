const Booking = require("../models/bookingModel.js");
const User = require("../models/userModel");

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
  const service_provider = await User.findById(req.query.service_providerId);

  if (service_provider.available === false) {
    return next(new appError("driver is not available now", 404));
  } else {
    const ticket = await Booking.create({
      service_providerId: req.query.service_providerId,
      customerId: req.user._id,
      truckId: req.query.truckId,
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
  const ticket = await Booking.findById(req.query.ticket);
  const customerId = ticket.customerId;
  const customer = await User.findById(customerId);
  if (req.body.booked === true && ticket.booked === false) {
    ticket.booked = true;
  
    
    service_provider.available = false;
    service_provider.acceptedTransactions.push(ticket);
    service_provider.currentTransactions.pop(ticket);
    ticket.bookCode = customer.createOTP();
    await ticket.save();
    customer.acceptedTransactions.push(ticket);
    customer.currentTransactions.pop(ticket);

    await service_provider.save({ validateBeforeSave: false });
    await customer.save({ validateBeforeSave: false });
    res.status(201).json({
      success: true,
    });
  } else {
    service_provider.available = true;
    service_provider.currentTransactions.pop(ticket);
    customer.currentTransactions.pop(ticket);

    await service_provider.save({ validateBeforeSave: false });
    await customer.save({ validateBeforeSave: false });
    res.status(200).json({
      status: "success",
      message: "تم رفض الطلب",
    });
  }
});
exports.confirmProcess = catchAsync(async (req, res, next) => {
  const ticket = await Booking.findById(req.query.ticket);
  const service_providerId = ticket.service_providerId;
  const service_provider = await User.findById(service_providerId);
  const customerId = ticket.customerId;
  const customer = await User.findById(customerId);
  const code = req.body.code;
  if (req.user.role === "service_provider") {
    if (code === ticket.bookCode) {
      ticket.service_provider= true;
      service_provider.available = true;
      service_provider.doneTransactions.push(ticket);
      service_provider.acceptedTransactions.pop(ticket);
      customer.doneTransactions.push(ticket);
      customer.acceptedTransactions.pop(ticket);
      await ticket.save();
      await service_provider.save({ validateBeforeSave: false });
      await customer.save({ validateBeforeSave: false });

      res.status(200).json({
        status: "success",
        message: "تهانينا علي اكمالك المهمة بنجاح!",
      });
    }
    // } else if (req.user.role === "customer") {

    //   if (code === ticket.bookCode) {
    //     ticket.service_providerCode = true;
    //     await ticket.save();
    //     res.status(200).json({
    //       status: "success",
    //       message: "we will take payment from your account",
    //     });
    //   }
  }
});
exports.getAllbooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.find();
  results = booking.length;
  if (results == 0) return next(new appError("there was no equipments", 404));
  res.status(200).json({
    results,
    booking,
  });
});
exports.getTicket = catchAsync(async (req, res, next) => {
  const ticket = await Booking.findById(req.params.id);

  if (!ticket)
    return next(
      new appError(`there is no ticket with id ${req.params.id}`, 404)
    );

  res.status(200).json({
    ticket,
  });
});
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
