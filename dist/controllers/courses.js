"use strict";
const ErrorResponse = require('../utils/errorResponse');
const Course = require('../models/Course');
const asyncHandler = require('../middleware/async');
const Bootcamp = require('../models/Bootcamp');
exports.getCourses = asyncHandler(async (req, res) => {
    if (req.params.bootcampId) {
        const courses = await Course.find({ bootcamp: req.params.bootcampId });
        return res.status(200).json({
            success: true,
            count: courses.length,
            data: courses,
        });
    }
    return res.status(200).json(res.advancedResults);
});
exports.getCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description',
    });
    if (!course) {
        return next(new ErrorResponse(`No course found with the id of ${req.params.id}`), 404);
    }
    res.status(200).json({
        success: true,
        data: course,
    });
});
exports.addCourse = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);
    if (!bootcamp) {
        return next(new ErrorResponse(`No bootcamp found with the id of ${req.params.bootcampId}`), 404);
    }
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`The user ${req.user.id} is not authorized to add a course to bootcamp ${bootcamp._id}`, 401));
    }
    const course = await Course.create(req.body);
    res.status(200).json({
        success: true,
        data: course,
    });
});
exports.updateCourse = asyncHandler(async (req, res, next) => {
    let course = await Course.findById(req.params.id);
    if (!course) {
        return next(new ErrorResponse(`No course found with the id of ${req.params.bootcampId}`), 404);
    }
    if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`The user ${req.user.id} is not authorized to update course ${course._id}`, 401));
    }
    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        success: true,
        data: course,
    });
});
exports.deleteCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id);
    if (!course) {
        return next(new ErrorResponse(`No course found with the id of ${req.params.bootcampId}`), 404);
    }
    if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`The user ${req.user.id} is not authorized to delete course ${course._id}`, 401));
    }
    await course.remove();
    res.status(200).json({
        success: true,
        data: {},
    });
});
//# sourceMappingURL=courses.js.map