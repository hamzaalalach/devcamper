const Bootcamp = require('../models/Bootcamp');

exports.getBootcamps = (req, res, next) => {};

exports.getBootcamp = (req, res, next) => {};

exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({
      success: true,
      data: bootcamp
    });
  } catch (error) {
    res.status(400).json({
      success: false
    });
  }
};

exports.updateBootcamp = (req, res, next) => {};

exports.deleteBootcamp = (req, res, next) => {};
