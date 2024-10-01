const express = require('express');
const roleController = require('../controllers/roleController.js');
const router = express.Router();

router.get('/', roleController.getAllRoles);

module.exports = router