const express = require("express");
const router = express.Router();
const customerControllers = require("../controllers/customerControllers");
const authController = require("../controllers/authControllers");
const contactUs = require("../utils/contactUs");
const upload = require("../controllers/multer");

router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.post("/verfiy", authController.protect, authController.verfiy);
router.post("/forgotPassword", authController.forgotPassword);
router.post("/contact", contactUs.contactUS);
router.patch("/resetPassword/:token", authController.resetPassword);
router.patch(
  "/updatePassword",
  authController.protect,
  authController.updatePassword
);
router.patch(
  "/updateMe",
  authController.protect,
  upload.single("avatar"),
  customerControllers.updateMe
);
router.delete(
  "/deleteMe",
  authController.protect,
  customerControllers.deleteMe
);
router.post(
  "/license",
  authController.protect,
  upload.single("image"),
  customerControllers.getLicense
);

router.route("/").get(customerControllers.getAllusers);
router.route("/:id").get(customerControllers.getUser);
module.exports = router;
