const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide group name'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'Please provide group description']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Please provide creator']
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: Date,
    active: {
      type: Boolean,
      default: true,
      select: false
    },
    __v: {
      type: Number,
      select: false
    }
  },
);

groupSchema.pre('save', function(next) {
  this.updatedAt = Date.now();

  next();
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
