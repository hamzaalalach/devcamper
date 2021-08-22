const ErrorResponse = require('../utils/errorResponse');
const Bootcamp = require('../models/Bootcamp');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const path = require('path');

exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let reqQuery = { ...req.query };
  const removeFields = [ 'select', 'sort', 'page', 'limit' ];
  removeFields.forEach(field => delete reqQuery[field]);

  // Filtering
  let query = JSON.stringify(reqQuery);
  query = query.replace(/\b(lt|lte|gt|gte)\b/g, match => `$${match}`);
  let bootcampsQuery = Bootcamp.find(JSON.parse(query)).populate('courses');

  // Selecting
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    bootcampsQuery = bootcampsQuery.select(fields);
  }

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    bootcampsQuery = bootcampsQuery.sort(sortBy);
  } else {
    bootcampsQuery = bootcampsQuery.sort('-createdAt');
  }

  // Paginating
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();

  const bootcamps = await bootcampsQuery.skip(startIndex).limit(limit);

  // Pagination results
  let pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps
  });
});

exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: bootcamp
  });
});

exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({
    success: true,
    data: bootcamp
  });
});

exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!bootcamp) return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));

  res.status(200).json({
    sucess: true,
    data: bootcamp
  });
});

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
  }

  bootcamp.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;
  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: {
        $centerSphere: [ [ lng, lat ], radius ]
      }
    }
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
  });
});

exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
  }

  if (!req.files) {
    return next(new ErrorResponse('Please upload a file', 400));
  }

  const file = req.files.file;

  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse('Please upload an image file', 400));
  }

  if (file.size > process.env.FILE_UPLOAD_LIMIT) {
    return next(new ErrorResponse(`Please upload an image less than ${process.env.FILE_UPLOAD_LIMIT}`, 400));
  }

  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async error => {
    if (error) {
      console.error(error);
      return next(new ErrorResponse('Error with file upload', 500));
    }
  });

  await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

  res.status(200).json({
    sucess: true,
    data: file.name
  });
});
