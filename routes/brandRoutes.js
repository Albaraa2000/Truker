const {
  createBrand,
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand,
} = require("./../controllers/brandControllers");
const {restrictTo,protect} = require("../controllers/authControllers");

const router = require("express").Router();

router
  .route("/")
  .post(protect, restrictTo("admin"), createBrand)
  .get(getBrands);
router
  .route("/:id")
  .get(getBrand)
  .put(protect, restrictTo("admin"), updateBrand)
  .delete(protect, restrictTo("admin"), deleteBrand);

module.exports = router;
