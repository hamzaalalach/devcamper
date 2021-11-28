const asyncHandler = require("../middleware/async");
const Review = require("../models/Review");

exports.getReviews = asyncHandler(async (req, res) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } else {
    return res.status(200).json(res.advancedResults);
  }
});