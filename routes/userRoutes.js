const express = require('express');
const { signUp, login } = require('../controllers/userController');
const router = express.Router();

//user authentication routes
router.route('/sign-up').post(signUp);
router.route('/login').post(login);

module.exports = router;