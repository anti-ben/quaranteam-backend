const express = require('express');
const userInfoController = require('../controllers/userInfoController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', userInfoController.getAllUserInfos)

router.use(authController.protect);

router.post('/', userInfoController.createUserInfo);

router.get('/:id/:date', userInfoController.getUserInfoByDate);

router
  .route('/:id')
  .get(userInfoController.getUserInfo)
  .patch(userInfoController.updateUserInfo)

module.exports = router;
