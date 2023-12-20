const express = require('express');
const router = express.Router();
const roleController = require('../Controllers/roleController');

router.get('/create', roleController.createTableRoles);

module.exports = router;