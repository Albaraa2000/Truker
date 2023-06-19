const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingControllers");
const truckControllers = require("../controllers/truckControllers");

const authController = require("../controllers/authControllers");

router
  .route("/book_truck")
  .post(
    authController.protect,
    authController.restrictTo("customer"),
    bookingController.bookTicket
  );

router.route("/").get(bookingController.getAllbooking);
router
  .route("/:id")
  .get(
    authController.protect,
    // authController.restrictTo("customer"),
    bookingController.getTicket
  );
router
  .route("/confirm")
  .post(
    authController.protect,
    authController.restrictTo("service_provider"),
    bookingController.confirmTicket
  );
router
  .route("/confirmProccess")
  .post(
    authController.protect,
    authController.restrictTo("service_provider","customer"),
    bookingController.confirmProcess
  );
//   .delete(authController.protect, bookingController.deleteEquipment)
//   .patch(authController.protect, bookingController.updateEquipment);
module.exports = router;
