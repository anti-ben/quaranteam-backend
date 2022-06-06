const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
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
      required: [true, 'Please provide post_id']
    },
    issue: {
      type: String,
      required: [true, 'Please provide issue']
    },
    category: {
      type: String,
      required: [true, 'Please provide category']
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

reportSchema.index({ post: 1 });

reportSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: '_id name'
  }).populate({
    path: 'group',
    select: '_id name'
  });

  next();
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
