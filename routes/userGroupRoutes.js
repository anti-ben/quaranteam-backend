const express = require('express');
const userGroupController = require('../controllers/userGroupController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(userGroupController.getAllUserGroups)
  .post(authController.protect, userGroupController.createUserGroup);

router.use(authController.protect);

router
  .route('/:id')
  .get(userGroupController.getUserGroup)
  .patch(userGroupController.updateUserGroup)
  .delete(userGroupController.deleteUserGroup);

module.exports = router;
