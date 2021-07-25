const ErrorResponse = require('../utils/errorResponse');
const Course = require('../models/Course');
const asyncHandler = require('../middleware/async');
const Bootcamp = require('../models/Bootcamp');

exports.getCourses = asyncHandler(async (req, res) => {
  let query;

  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Course.find().populate({
      path: 'bootcamp',
      select: 'name description'
    });
  }

  const courses = await query;

  res.status(200).json({
    success: true,
    data: courses,
    count: courses.length
  });
});

exports.getCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description'
  });

  if (!course) {
    return next(new ErrorResponse(`No course found with the id of ${req.params.id}`), 404);
  }

  res.status(200).json({
    success: true,
    data: course
  });
});

exports.addCourse = asyncHandler(async (req, res) => {
  req.body.bootcamp = req.params.bootcampId;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(new ErrorResponse(`No bootcamp found with the id of ${req.params.bootcampId}`), 404);
  }

  const course = await Course.create(req.body);

  res.status(200).json({
    success: true,
    data: course
  });
});