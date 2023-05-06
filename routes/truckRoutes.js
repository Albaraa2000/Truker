const { restrictTo, protect } = require("../controllers/authControllers");
const {
  createTruck,
  getTrucks,
  getTruck,
  updateTruck,
  deleteTruck,
} = require("./../controllers/truckControllers");

const router = require("express").Router();
const upload = require("../utils/multer");

router
  .route("/")
  .post(protect, restrictTo("admin", "user"), upload.single("imageCover"),createTruck)
  .get(getTrucks);
router
  .route("/:id")
  .get(getTruck)
  .put(protect, restrictTo("admin", "user"), updateTruck)
  .delete(protect, restrictTo("admin", "user"), deleteTruck);

module.exports = router;
