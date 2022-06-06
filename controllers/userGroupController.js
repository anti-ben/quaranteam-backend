const UserGroup = require('../models/userGroupModel');
const factory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getAllUserGroups = factory.getAll(UserGroup);
exports.createUserGroup = factory.createOne(UserGroup);
exports.updateUserGroup = factory.updateOne(UserGroup);
exports.deleteUserGroup = factory.deleteOne(UserGroup);

exports.getUserGroup = catchAsync(async (req, res, next) => {
    const doc = await UserGroup.find({ user: req.params.id });

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
