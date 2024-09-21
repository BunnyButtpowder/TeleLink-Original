const express = require('express');
const createError = require('http-errors');
const authController = require('../controllers/authController.js');
const router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.put('/change-password/:id', authController.changePassword);
module.exports = router;