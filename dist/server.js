"use strict";
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const morgan = require('morgan');
// eslint-disable-next-line no-unused-vars
const colors = require('colors');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileupload = require('express-fileupload');
const errorHandler = require('./middleware/error');
dotenv.config();
const { connectDB, closeDB } = require('./config/db');
const { PORT, NODE_ENV } = require('./config');
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
app.use(xss());
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
const server = app.listen(PORT, console.log(`Server is running in ${NODE_ENV} on port ${process.env.PORT}`.yellow.bold));
const closeGracefully = () => {
    closeDB();
    server.close(() => process.exit(0));
};
process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`.red);
    server.close(() => process.exit(1));
});
process.on('SIGINT', closeGracefully);
process.on('SIGTERM', closeGracefully);
//# sourceMappingURL=server.js.map