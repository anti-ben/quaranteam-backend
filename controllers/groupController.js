const Group = require('../models/groupModel');
const factory = require('./handlerFactory');

exports.getAllGroups = factory.getAll(Group);
exports.getGroup = factory.getOne(Group);
exports.createGroup = factory.createOne(Group);
exports.updateGroup = factory.updateOne(Group);
exports.deleteGroup = factory.deleteOne(Group);
