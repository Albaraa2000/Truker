const {restrictTo,protect} = require("../controllers/authControllers");
const {
  createSubCategory,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
} = require("./../controllers/subcategoryControllers");

const router = require("express").Router({ mergeParams: true });

router
  .route("/")
  .post(protect, restrictTo("admin"), createSubCategory)
  .get(getSubCategories);
router
  .route("/:id")
  .get(getSubCategory)
  .put(protect, restrictTo("admin"), updateSubCategory)
  .delete(protect, restrictTo("admin"), deleteSubCategory);

module.exports = router;
