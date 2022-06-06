const mongoose = require('mongoose');
const Post = require('./postModel');

const reactSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.ObjectId,
      ref: 'Post',
      required: [true, 'Please provide post_id']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user_id']
    },
    reaction: {
      type: String,
      enum: ['like', 'takeCare', 'meToo'],
      required: [true, 'Please provide reaction']
    },
    __v: {
      type: Number,
      select: false
    }
  },
  {
    timestamps: true
  }
);

reactSchema.index({ post: 1 });
reactSchema.index({ post: 1, user: 1, reaction: 1 }, { unique: true });

reactSchema.statics.calcReacts = async function(postId, reaction) {
  if (!postId) return;
  const stats = await this.aggregate([
    {
      $match: {
        $and: [
          { post: postId },
          { reaction: reaction }
        ]
      }
    },
    {
      $group: {
        _id: '$post',
        count: { $sum: 1 },
      }
    }
  ]);

  let post = await Post.findById(postId);
  post.reaction[reaction] = stats.length ? stats[0].count : 0;
  const project = await Post.updateOne({ _id: postId }, { reaction: post.reaction });
};

reactSchema.post('save', async function () {
  await this.constructor.calcReacts(this.post, this.reaction);
});

reactSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();

  next();
});
reactSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calcReacts(this.r.post, this.r.reaction);
});

const React = mongoose.model('React', reactSchema);

module.exports = React;
