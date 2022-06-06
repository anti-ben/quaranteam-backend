const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell us your name!'],
      maxlength: [20, 'A name must have less or equal then 20 characters'],
      minlength: [4, 'A name must have more or equal then 4 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      maxlength: [250, 'too long'],
      validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: {
      type: String,
      default: 'default.jpg'
    },
    firstName: {
      type: String,
      required: [true, 'Please provide your firstName'],
      maxlength: [250, 'too long'],
    },
    lastName: {
      type: String,
      required: [true, 'Please provide your lastName'],
      maxlength: [250, 'too long'],
    },
    age: {
      type: Number,
      required: [true, 'Please provide your age'],
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer not to say'],
      required: [true, 'Please provide your gender'],
    },
    prefecture: {
      type: String,
      required: [true, 'Please provide your prefecture'],
    },
    endDate: {
      type: Date,
      required: [true, 'Please provide end date'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      maxlength: [16, 'password must have less or equal then 16 characters'],
      minlength: [4, 'password must have more or equal then 4 characters'],
      select: false
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        // This only works on CREATE and SAVE!!!
        validator: function (el) {
          return el === this.password;
        },
        message: 'Passwords are not the same!'
      }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
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
  // {
  //   toJSON: { virtuals: true },
  //   toObject: { virtuals: true },
  //   id: false
  // }
);

// exclude virtual daysLeft field during populate?
// userSchema.virtual('daysLeft').get(function () {
//   return parseInt((this.endDate - Date.now()) / 1000 / 60 / 60 / 24, 10);
// });

userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// userSchema.pre(/^find/, function(next) {
//   // this points to the current query
//   this.find({ active: { $ne: false } });
//   next();
// });

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
