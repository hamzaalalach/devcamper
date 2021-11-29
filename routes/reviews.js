const express = require('express');
const advancedResuts = require('../middleware/advancedResults');
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require('../middleware/auth');
const { getReviews, getReview, addReview, updateReview, deleteReview } = require('../controllers/reviews');
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
  .post(protect, authorize('user', 'admin'), addReview);

router
  .route('/:id')
  .get(getReview)
  .put(protect, authorize('user', 'admin'), updateReview)
  .delete(protect, authorize('user', 'admin'), deleteReview);

module.exports = router;
