const express = require('express');
const { register, login, getMe, forgotPassword, resetPassword, updateDetails } = require('../controllers/auth');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.get('/me', protect, getMe);
router.put('/update-details', protect, updateDetails);

module.exports = router;
