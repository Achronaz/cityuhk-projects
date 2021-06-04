var express = require('express');
var router = express.Router();

var indexController = require('../controllers/index');
var userController = require('../controllers/api_user');
var manageController = require('../controllers/api_manage');
var orderController = require('../controllers/api_order');

//page
router.use('/', indexController);

//restful
router.use('/api/user', userController);
router.use('/api/manage', manageController);
router.use('/api/order', orderController);

module.exports = router;
