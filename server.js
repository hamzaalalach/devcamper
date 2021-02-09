const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const bootcamps = require('./routes/bootcamps');

dotenv.config({ path: './config/config.env' });
connectDB();
const app = express();
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/v1/bootcamps', bootcamps);

const server = app.listen(
  PORT,
  console.log(`Server is running in ${process.env.NODE_ENV} on port ${process.env.PORT}`)
);

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);

  server.close(() => process.exit(1));
});
