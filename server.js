const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const errorHandler = require('./middleware/error');

dotenv.config({ path: './config/config.env' });

const connectDB = require('./config/db');
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');

connectDB();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(fileupload());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use(errorHandler);

const server = app.listen(
  PORT,
  console.log(`Server is running in ${process.env.NODE_ENV} on port ${process.env.PORT}`.yellow.bold)
);

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);

  server.close(() => process.exit(1));
});
