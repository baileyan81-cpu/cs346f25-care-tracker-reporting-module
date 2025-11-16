/**
 * Users Routes
 *
 * Handles login / logout (and later registration, profile, etc.).
 */

const express = require('express');
const router = express.Router();

const usersController = require('../controllers/usersController');

// GET /users/login → show login form
router.get('/login', usersController.getLogin);
// POST /users/login → handle login submission
router.post('/login', usersController.postLogin);

// GET /users/register → show login form
router.get('/register', usersController.getRegister);
// POST /users/register → handle login submission
router.post('/register', usersController.postRegister);

// POST /users/logout → handle logout
router.post('/logout', usersController.postLogout);

//Profile routes
router.get('/profile', usersController.getProfile);
router.post('/profile', usersController.postProfile);

module.exports = router;
