const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

/**
 * @swagger
 * definitions:
 *   User:
 *     properties:
 *       name:
 *         type: string
 *       email:
 *         type: string
 *       firstName:
 *         type: string
 *       lastName:
 *         type: string
 *       age:
 *         type: integer
 *       gender:
 *         type: string
 *       prefecture:
 *         type: string
 *       daysLeft:
 *         type: integer
 *       password:
 *         type: string
 *       passwordConfirm:
 *         type: string
 */

/**
 * @swagger
 * /api/v1/users/signup:
 *   post:
 *     tags:
 *       - users
 *     summary: register new user
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - name
 *             - email
 *             - firstName
 *             - lastName
 *             - age
 *             - gender
 *             - prefecture
 *             - daysLeft
 *             - password
 *             - passwordConfirm
 *           $ref: '#/definitions/User'
 *     responses:
 *       200:
 *         description: nameにJohnを指定した場合、挨拶を返す
 *
 */
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.get('/', userController.getAllUsers);

router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);
router.get('/me', userController.getMe, userController.getUser);
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.delete('/deleteMe', userController.deleteMe);

router
  .route('/')
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
