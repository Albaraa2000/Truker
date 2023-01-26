const express = require('express');
const router = express.Router();
const equipmentsController = require('../controllers/equipmentsController');

router
  .route('/')
  .post(equipmentsController.createEquipments)
  .get(equipmentsController.getAllequipments);
  module.exports = router;