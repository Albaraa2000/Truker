const express = require("express");
const router = express.Router();
const equipmentsController = require("../controllers/equipmentsController");
const authController = require("../controllers/authControllers");
const apiKeyMiddleware = require("../utils/apiKeyMiddleware");
const upload = require("../utils/multer");

// router
//   .route("/location")
//   .post(equipmentsController.saveLocation)
//   .get(equipmentsController.getLocation);

router
  .route("/")
  .post(
    authController.protect,
    authController.restrictTo("service_provider"),
    upload.single("photo"),
    equipmentsController.createEquipments
  )
  .get(equipmentsController.getAllequipments);
router
  .route("/:id")
  .get(equipmentsController.getEquipment)
  .delete(authController.protect, equipmentsController.deleteEquipment)
  .patch(authController.protect, equipmentsController.updateEquipment);
module.exports = router;
