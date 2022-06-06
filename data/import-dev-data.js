const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./../models/userModel');
const Group = require('./../models/groupModel');
const Post = require('./../models/postModel');
const React = require('./../models/reactModel');
const Report = require('./../models/reportModel');
const UserGroup = require('./../models/userGroupModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connection successful!'));

// READ JSON FILE
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const groups = JSON.parse(fs.readFileSync(`${__dirname}/groups.json`, 'utf-8'));
const posts = JSON.parse(fs.readFileSync(`${__dirname}/posts.json`, 'utf-8'));
const reacts = JSON.parse(fs.readFileSync(`${__dirname}/reacts.json`, 'utf-8'));
const reports = JSON.parse(fs.readFileSync(`${__dirname}/reports.json`, 'utf-8'));
const userGroups = JSON.parse(fs.readFileSync(`${__dirname}/userGroups.json`, 'utf-8'));


// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await User.create(users, { validateBeforeSave: false });
    await Group.create(groups);
    await Report.create(reports);
    await UserGroup.create(userGroups);
    await Post.create(posts);
    for (let e of reacts) {
      await React.create(e);
    };
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Group.deleteMany();
    await Post.deleteMany();
    await React.deleteMany();
    await Report.deleteMany();
    await UserGroup.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
