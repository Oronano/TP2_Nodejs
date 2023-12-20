const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');

const Middlewaresauth = require('../Middlewares/middleware.js');


router.get('/create', userController.createTableUser);
// router.post('/add', userController.addUser);
router.post('/register', userController.Register);
router.get('/login', Middlewaresauth.authenticator, userController.Login);
router.delete('/delete', userController.deleteUser);
router.post('/addRoleUser', userController.addRoleUser);
router.delete('/deleteRoleUser', userController.deleteRoleUser);

router.get('/getUsersfromGods', Middlewaresauth.admin, userController.GetUsersfromGods);

module.exports = router;