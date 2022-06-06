const mongoose = require('mongoose');

const userInfoSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Please provide your user_id']
    },
    symptom: {
      type: [String],
      required: [true, 'Please provide your symptom'],
    },
    mood: {
      type: String,
      required: [true, 'Please provide your mood'],
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

userInfoSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: '_id name'
  });

  next();
});

const UserInfo = mongoose.model('UserInfo', userInfoSchema);

module.exports = UserInfo;
