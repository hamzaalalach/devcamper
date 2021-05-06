const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const errorHandler = require('./middleware/error');

const connectDB = require('./config/db');
const bootcamps = require('./routes/bootcamps');

dotenv.config({ path: './config/config.env' });
connectDB();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use('/api/v1/bootcamps', bootcamps);
app.use(errorHandler);

const server = app.listen(
  PORT,
  console.log(`Server is running in ${process.env.NODE_ENV} on port ${process.env.PORT}`.yellow.bold)
);

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);

  server.close(() => process.exit(1));
});
