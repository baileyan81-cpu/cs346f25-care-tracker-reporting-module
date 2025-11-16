const express = require('express');
const router = express.Router();

// Import controllers
const classesController = require('../controllers/classesController');

// Define routes
// Route: GET / → indexController.getHome
// Renders view 'index' with locals: title, // data, //csrfToken.
// Relies on model(s): SomeModel for database access.
router.get('/', classesController.getClasses);

// Route: GET /class_report/:id → classesController.getClassById
// Renders view 'classReport' with locals: title.
// Uses route params (req.params) to drive controller logic.
router.get('/class_report/:id', classesController.getClassById);

// dummy comment

module.exports = router;
