const express = require('express');
const router = express.Router();

// Import controllers
const controller = require('../controllers/clinicalHoursController');

router.get('/csvExport', controller.exportClinicalHoursCsv);

module.exports = router;
