const express = require('express');
const groupController = require('../controllers/groupController');
const authController = require('../controllers/authController');
const postRouter = require('../routes/postRoutes');

const router = express.Router();

router.use('/:groupId/posts', postRouter);

router
  .route('/')
  .get(groupController.getAllGroups)
  .post(authController.protect, groupController.createGroup);

router
  .route('/:id')
  .get(groupController.getGroup)
  .patch(authController.protect, groupController.updateGroup)
  .delete(authController.protect, groupController.deleteGroup);

module.exports = router;
