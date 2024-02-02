const express = require('express');
const router = express.Router();
const authController = require('./authController');

router.get('/test', authController.test);
router.post('/login', authController.login);
router.post('/signup', authController.signup);

module.exports = router;

