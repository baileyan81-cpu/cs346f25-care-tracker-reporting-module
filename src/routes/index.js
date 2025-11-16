const express = require('express');
const router = express.Router();

// Import controllers
const indexController = require('../controllers/indexController');

// Define routes
// Route: GET / → indexController.getHome
// Renders view 'index' with locals: title, // data, //csrfToken.
// Relies on model(s): SomeModel for database access.
router.get('/', indexController.getHome);

// dummy comment

module.exports = router;
