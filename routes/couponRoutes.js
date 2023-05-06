const {restrictTo,protect} = require("../controllers/authControllers");

const {
  createCoupon,
  getCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
} = require("./../controllers/couponControllers.js");

const router = require("express").Router();

router
  .route("/")
  .post(protect, restrictTo("admin"), createCoupon)
  .get(getCoupons);
router
  .route("/:id")
  .get(getCoupon)
  .put(protect, restrictTo("admin"), updateCoupon)
  .delete(protect, restrictTo("admin"), deleteCoupon);

module.exports = router;
