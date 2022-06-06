const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user_id']
    },
    group: {
      type: mongoose.Schema.ObjectId,
      ref: 'Group',
      required: [true, 'Please provide group_id']
    },
    post: {
      type: mongoose.Schema.ObjectId,
      ref: 'Post',
    },
    title: {
      type: String,
      trim: true,
      maxlength: [1000, 'too long'],
    },
    content: {
      type: String,
      trim: true,
      required: [true, 'Please provide content'],
      maxlength: [1000, 'too long'],
    },
    hashtag: [String],
    reaction: {
      like: {
        type: Number,
        default: 0
      },
      takeCare: {
        type: Number,
        default: 0
      },
      meToo: {
        type: Number,
        default: 0
      },
      comment: {
        type: Number,
        default: 0
      },
    },
    reacted: {
      like: {
        type: Boolean,
        default: false,
      },
      takeCare: {
        type: Boolean,
        default: false,
      },
      meToo: {
        type: Boolean,
        default: false,
      },
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

postSchema.index({ post: 1 });

postSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: '_id name photo'
  }).populate({
    path: 'group',
    select: '_id name'
  });

  next();
});

postSchema.statics.calcComments = async function (postId) {
  if (!postId) return;
  const stats = await this.aggregate([
    {
      $match: { post: postId }
    },
    {
      $group: {
        _id: '$post',
        count: { $sum: 1 },
      }
    }
  ]);

  await Post.findByIdAndUpdate(postId, {
    'reaction.comment': stats.length > 0 ? stats[0].count : 0
  });

};

postSchema.post('save', async function () {
  await this.constructor.calcComments(this.post);
});

postSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();

  next();
});
postSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calcComments(this.r.post);
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
