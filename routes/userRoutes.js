const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/userControllers");
const authController = require("../controllers/authControllers");
// const contactUs = require("../utils/contactUs");
const upload = require("../utils/multer");

router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.post("/verfiy", authController.protect, authController.verfiy);
router.post("/forgotPassword", authController.forgotPassword);
router.post(
  "/sendOtpAgain",
  authController.protect,
  authController.sendOtpAgain
);
// router.post("/contact", contactUs.contactUS);

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
  userControllers.updateMe
);
router.delete(
  "/deleteMe",
  authController.protect,
  userControllers.deleteMe
);
// router.post(
//   "/license",
//   authController.protect,
//   upload.single("image"),
//   userControllers.getLicense
// );

router.route("/").get(userControllers.getAllusers);
router.route("/ocr").post(upload.single("image"),userControllers.getLicense);
router.route("/:id").get(userControllers.getUser);
module.exports = router;
