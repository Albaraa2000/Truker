const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingControllers");
const truckControllers = require("../controllers/truckControllers");

const authController = require("../controllers/authControllers");


router
  .route("/book-truck/:id")
  .post(authController.protect,authController.restrictTo("customer"),truckControllers.toBook,bookingController.bookTicket)
//   .get(bookingController.getLocation);

router
  .route("/")
  .get(bookingController.getAllbooking);
router
//   .route("/:id")
//   .get(bookingController.getEquipment)
//   .delete(authController.protect, bookingController.deleteEquipment)
//   .patch(authController.protect, bookingController.updateEquipment);
module.exports = router;
