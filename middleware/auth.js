const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('./async');

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token
  }

  if (!token) {
    next(new ErrorResponse('Unauthorized', 401));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(payload.id);

    next();
  } catch (err) {
    next(new ErrorResponse('Unauthorized', 401));
  }
});

exports.authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    next(new ErrorResponse(`Role ${req.user.role} is not authorized to access this route`, 403));
  }

  next();
};
