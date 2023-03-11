const express = require("express");
const router = express.Router();
const equipmentsController = require("../controllers/equipmentsController");
const authController = require("../controllers/authControllers");
const apiKeyMiddleware = require('../controllers/apiKeyMiddleware');
const upload = require("../controllers/multer");

router
  .route("/")
  .post(authController.protect,authController.restrictTo('admin'),upload.single("photo"), equipmentsController.createEquipments)
   .get(equipmentsController.getAllequipments);

router
  .route("/:id")
  .get(equipmentsController.getEquipment)
  .delete(authController.protect, equipmentsController.deleteEquipment)
  .patch(authController.protect, equipmentsController.updateEquipment);
module.exports = router;
