const React = require('../models/reactModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getAllReacts = catchAsync(async (req, res, next) => {
  const doc = await React.find({
    $and: [
      {
        user: req.body.user
      },
      {
        post: req.params.postId
      }
    ]
  });

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

exports.createReact = async (req, res, next) => {
  req.body.post = req.params.postId;

  let doc;
  try {
    doc = await React.create(req.body);
  } catch (err) {
    if (err.name === 'MongoError') {
      await React.findOneAndDelete(req.body);
    }
  }
  res.status(201).json({
    status: 'success',
    data: {
      data: doc
    }
  });
}
