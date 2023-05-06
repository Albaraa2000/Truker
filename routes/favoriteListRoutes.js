const {restrictTo,protect} = require("../controllers/authControllers");
const {
  addToFavoriteList,
  removeFromFavoriteList,
  getUserFavoriteList,
} = require("../controllers/favoriteListControllers");

const router = require("express").Router();
router
  .route("/")
  .patch(protect, restrictTo("customer"), addToFavoriteList)
  .delete(protect, restrictTo("customer"), removeFromFavoriteList)
  .get(protect, restrictTo("customer"), getUserFavoriteList);

module.exports = router;
