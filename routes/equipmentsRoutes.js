const express = require("express");
const router = express.Router();
const equipmentsController = require("../controllers/equipmentsController");
const upload = require("../controllers/multer");


router
  .route("/")
  .post(upload.single("photo"),equipmentsController.createEquipments)
  .get(equipmentsController.getAllequipments);

router.route("/:id").get(equipmentsController.getEquipment);
module.exports = router;
