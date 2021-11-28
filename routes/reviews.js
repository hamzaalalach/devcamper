const express = require('express');
const advancedResuts = require('../middleware/advancedResults');
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require('../middleware/auth');
const { getReviews } = require('../controllers/reviews');
const Review = require('../models/Review');

router
  .route('/')
  .get(
    advancedResuts(Review, {
      path: 'bootcamp',
      select: 'name description'
    }),
    getReviews
  )

module.exports = router;
