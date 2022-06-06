// review / rating / createdAt / ref to tour / ref to user
const mongoose = require('mongoose');

const userGroupSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'UserGroup must belong to a user']
    },
    group: {
      type: mongoose.Schema.ObjectId,
      ref: 'Group',
      required: [true, 'UserGroup must belong to a group']
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

userGroupSchema.index({ user: 1, group: 1 });

// userGroupSchema.index({ user: 1, group: 1 }, { unique: true });

userGroupSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'group',
    select: '-user'
  });

  next();
});

const UserGroup = mongoose.model('UserGroup', userGroupSchema);

module.exports = UserGroup;
