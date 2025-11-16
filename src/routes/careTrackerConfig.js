const express = require('express');
const router = express.Router();
const careTrackerConfigController = require('../controllers/careTrackerConfigController');

// Define routes
// Route: GET / → indexController.getHome
// Renders view 'index' with locals: title, // data, //csrfToken.
// Relies on model(s): SomeModel for database access.
router.get('/', careTrackerConfigController.showConfigPage);
const controller = require('../controllers/careTrackerConfigController');

// Display table + form
// Route: GET / → indexController.getHome
// Renders view 'index' with locals: title, // data, //csrfToken.
// Relies on model(s): SomeModel for database access.
router.get('/', controller.showConfigPage);

// Handle form submission
// Route: POST /add_config → careTrackerConfigController.addConfig
// Uses form/body fields (req.body) to drive controller logic.
// Relies on model(s): CareTrackerConfig for database access.
router.post('/add_config', controller.addConfig);

// Route: POST /delete → careTrackerConfigController.deleteConfig
// Uses form/body fields (req.body) to drive controller logic.
// Relies on model(s): CareTrackerConfig for database access.
router.post('/delete', controller.deleteConfig);

module.exports = router;
