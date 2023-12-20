const express = require('express');
const router = express.Router();
const godsController = require('../Controllers/godsController');

router.get('/create', godsController.createTableGods);
router.post('/addgod', godsController.addGods);

module.exports = router;