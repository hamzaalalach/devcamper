const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');
// eslint-disable-next-line no-unused-vars
const colors = require('colors');
const dotenv = require('dotenv');

dotenv.config();

const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');
const User = require('./models/User');
const Review = require('./models/Review');
const { MONGO_URI } = require('./config');

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const bootcamps = JSON.parse(
  fs.readFileSync(path.join(__dirname, '_data/bootcamps.json'), 'utf-8')
);
const courses = JSON.parse(
  fs.readFileSync(path.join(__dirname, '_data/courses.json'), 'utf-8')
);
const users = JSON.parse(
  fs.readFileSync(path.join(__dirname, '_data/users.json'), 'utf-8')
);
const reviews = JSON.parse(
  fs.readFileSync(path.join(__dirname, '_data/reviews.json'), 'utf-8')
);

const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    await Course.create(courses);
    await User.create(users);
    await Review.create(reviews);
    console.log('Data imported...'.green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data deleted...'.red.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
