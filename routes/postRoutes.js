const express = require('express');
const postController = require('../controllers/postController');
const authController = require('../controllers/authController');
const reactRouter = require('../routes/reactRoutes');

const router = express.Router({ mergeParams: true });

router.use('/:postId/reacts', reactRouter);

router.use(authController.isLoggedIn);

router.route('/top-1-post').get(postController.aliasTopPosts, postController.getAllPosts);

router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPost);

router.use(authController.protect, postController.setGroupId);

router
  .route('/')
  .post(postController.createPost);

router
  .route('/:id')
  .patch(postController.updatePost)
  .delete(postController.deletePost);

module.exports = router;
