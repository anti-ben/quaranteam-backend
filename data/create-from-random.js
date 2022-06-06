const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/userModel');
const UserInfo = require('../models/userInfoModel');

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

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //不含最大值，含最小值
}

const generateUser = () => {
  const template = {
    "photo": "default.jpg",
    "role": "user",
    "active": true,
    "name": "test1",
    "email": "test1@rakuten.com",
    "firstName": "rakuten",
    "lastName": "rakuten",
    "age": 10,
    "gender": "male",
    "prefecture": "Tokyo",
    "password": "test",
    "endDate": "2022-06-16T07:24:00.840+00:00"
  };

  const prefs = ["Tokyo", "Tokyo", "Tokyo", "Tokyo", "Tokyo", "Fukuoka"];
  const ages = [20, 30, 40];
  template.name = `test${getRandomInt(100, 10000)}`;
  template.email = `${template.name}@rakuten.com`;
  template.age = ages[getRandomInt(0, ages.length)];
  template.prefecture = prefs[getRandomInt(0, prefs.length)];

  return template;
};


const generateUserInfo = (userId) => {
  const template = {
    "symptom": [
      "soreThroat"
    ],
    "mood": "good",
    "user": "627df3c17e49186405f9aabc"
  };

  const sys = ["fever", "headache", "soreThroat", "cough", "runnyNose", "lossOfSmell", "lossOfTaste", "noSymptom", "others"];
  template.symptom = [sys[getRandomInt(0, sys.length)]];
  template.user = userId;

  return template;
};

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    let users = [];
    for (let i = 0; i < 50; i++) users.push(generateUser());
    await User.create(users, { validateBeforeSave: false });

    const users = await User.find();
    let userInfos = [];
    for (let i = 0; i < 50; i++) userInfos.push(generateUserInfo(users[getRandomInt(0, users.length)]._id));
    await UserInfo.create(userInfos, { validateBeforeSave: false });

    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

importData();
