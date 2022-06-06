const express = require('express');
const reactController = require('../controllers/reactController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.post('/', authController.protect, reactController.createReact);

module.exports = router;
