const express = require('express');
const router = express.Router();

// Import controllers
const aboutController = require('../controllers/aboutController');

// Define routes
// Route: GET / → indexController.getHome
// Renders view 'index' with locals: title, // data, //csrfToken.
// Relies on model(s): SomeModel for database access.
router.get('/', aboutController.getAbout);

// dummy comment

module.exports = router;
