const express = require('express');
const advancedResuts = require('../middleware/advancedResults');
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require('../middleware/auth');
const { getReviews, getReview } = require('../controllers/reviews');
const Review = require('../models/Review');

router
  .route('/')
  .get(
    advancedResuts(Review, {
      path: 'bootcamp',
      select: 'name description'
    }),
    getReviews
  );

router
  .route('/:id')
  .get(getReview);

module.exports = router;
