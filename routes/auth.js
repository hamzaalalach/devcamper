const express = require('express');
const { register, login, getMe, forgotPassword, resetPassword, updateDetails, updatePassword, logout } = require('../controllers/auth');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);
router.put('/update-details', protect, updateDetails);
router.put('/update-password', protect, updatePassword);

module.exports = router;
