const express = require('express');
const reportController = require('../controllers/reportController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(reportController.getAllReports)
  .post(authController.protect, reportController.createReport);

router
  .route('/:id')
  .get(reportController.getReport)
  .patch(authController.protect, reportController.updateReport)
  .delete(authController.protect, reportController.deleteReport);

module.exports = router;
