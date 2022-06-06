const Post = require('../models/postModel');
const React = require('../models/reactModel');
const factory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');
const APIFeatures = require('./../utils/apiFeatures');
const AppError = require('./../utils/appError');

exports.aliasTopPosts = (req, res, next) => {
  req.query.limit = '1';
  req.query.sort = '-createdAt';

  next();
};

exports.setGroupId = (req, res, next) => {
  if (!req.body.group) req.body.group = req.params.groupId;

  next();
};

const setReaction = async (userId, doc) => {
  if (userId) {
    for (let i = 0; i < doc.length; i++) {
      let e = doc[i];
      const reacts = await React.find({
        $and: [
          {
            user: userId
          },
          {
            post: e._id
          }
        ]
      });
      reacts.forEach(r => { e.reacted[r.reaction] = true; });
      doc[i] = e;
    }
  }

  return doc;
}

exports.getAllPosts = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.groupId) filter = {
    $and: [
      {
        group: req.params.groupId
      },
      {
        post: { $exists: false }
      }
    ]
  };
  else filter = { post: { $exists: false } };

  const features = new APIFeatures(Post.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  let doc = await features.query;

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  doc = await setReaction(req.body.user, doc);

  res.status(200).json({
    status: 'success',
    results: doc.length,
    data: {
      data: doc
    }
  });
});

exports.getPost = catchAsync(async (req, res, next) => {
  let raw_doc = await Post.find({
    $or: [
      {
        _id: req.params.id
      },
      {
        post: { $exists: true }
      }
    ]
  });

  if (!raw_doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  raw_doc = await setReaction(req.body.user, raw_doc);

  const parent = raw_doc.filter(e => !e.post)[0];
  const children = raw_doc.filter(e => e.post);

  let doc;
  if (parent) {
    const getNestJson = (parent) => {
      const child = children.filter(e => String(e.post) === String(parent._id));
      if (child.length === 0) return parent;

      return { ...parent._doc, comments: child.map(e => getNestJson(e)) };
    };

    doc = getNestJson(parent);
  } else {
    doc = raw_doc.filter(e => String(e._id) === String(req.params.id));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: doc
    }
  });
});

exports.createPost = factory.createOne(Post);
exports.updatePost = factory.updateOne(Post);
exports.deletePost = factory.deleteOne(Post);
