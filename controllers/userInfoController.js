const UserInfo = require('../models/userInfoModel');
const factory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getAllUserInfos = factory.getAll(UserInfo);
exports.updateUserInfo = factory.updateOne(UserInfo);

exports.getUserInfo = catchAsync(async (req, res, next) => {
  const doc = await UserInfo.find({ user: req.params.id });

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    results: doc.length,
    data: {
      data: doc
    }
  });
});

const filterDate = (curDate) => {
  const date = curDate ? new Date(curDate) : new Date();
  return {
    createdAt: {
      '$gte': new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      '$lt': new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
    }
  };
}

exports.getUserInfoByDate = catchAsync(async (req, res, next) => {
  const doc = await UserInfo.find({
    $and: [
      { user: req.params.id },
      filterDate(req.params.date)
    ]
  });

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: doc
    }
  });
});

exports.createUserInfo = catchAsync(async (req, res, next) => {
  const userInfo = await UserInfo.find({
    $and: [
      { user: req.user._id },
      filterDate()
    ]
  });

  if (userInfo.length) {
    return next(new AppError('The user have been asked', 404));
  }

  const doc = await UserInfo.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      data: doc
    }
  });
});
