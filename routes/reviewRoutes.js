const {restrictTo,protect} = require("../controllers/authControllers");
const {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
} = require("./../controllers/reviewControllers");

const router = require("express").Router();

router
  .route("/")
  .post(protect, restrictTo("customer"), createReview)
  .get(getReviews);
router
  .route("/:id")
  .get(getReview)
  .patch(protect, restrictTo("customer"), updateReview)
  .delete(protect, restrictTo("admin", "customer"), deleteReview);

module.exports = router;
