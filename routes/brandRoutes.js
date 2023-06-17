const {
  createBrand,
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand,
} = require("./../controllers/brandControllers");
const {restrictTo,protect} = require("../controllers/authControllers");

const router = require("express").Router();
const upload = require("../utils/multer");

router
  .route("/")
  .post(protect, restrictTo("admin"),upload.single("image"),  createBrand)
  .get(getBrands);
router
  .route("/:id")
  .get(getBrand)
  .patch(protect, restrictTo("admin"), updateBrand)
  .delete(protect, restrictTo("admin"), deleteBrand);

module.exports = router;
