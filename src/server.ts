import express from 'express';
import path from 'path';
import morgan from 'morgan';
// eslint-disable-next-line no-unused-vars
const colors = require('colors');
import mongoSanitize from 'express-mongo-sanitize';
import helmet from "helmet";
const rateLimit = require('express-rate-limit');
import hpp from 'hpp';
import cors from 'cors';
// const cookieParser = require('cookie-parser');
import cookieParser from 'cookie-parser';
import fileupload from 'express-fileupload';
import  errorHandler from './middleware/error';
import "dotenv/config";

import { connectDB, closeDB } from './config/db';
import { PORT, NODE_ENV } from './config';

connectDB();
const app = express();
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
});

app.use(express.json());
app.use(cookieParser());

if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(fileupload());
app.use(helmet());
app.use(mongoSanitize());
app.use(limiter);
app.use(hpp());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/v1/bootcamps', require('./routes/bootcamps'));
app.use('/api/v1/courses', require('./routes/courses'));
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/reviews', require('./routes/reviews'));

app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(
    `Server is running in ${NODE_ENV} on port ${colors.yellow.bold(process.env.PORT)}`
  )
});

const closeGracefully = () => {
  closeDB();
  server.close(() => process.exit(0));
};

process.on('unhandledRejection', (err: any) => {
  console.log(`Error: ${colors.red(err.message)}`);

  server.close(() => process.exit(1));
});
process.on('SIGINT', closeGracefully);
process.on('SIGTERM', closeGracefully);
