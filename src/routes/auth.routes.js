import express from 'express';
import { login } from '../controllers/authController.js';
import { sendEmailOTP, sendMobileOTP, verifyEmailOTP, verifyMobileOTP } from '../controllers/otpController.js';

const router = express.Router();

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', login);

// @route   POST /api/auth/otp/email
// @desc    Send OTP to email
// @access  Public
router.post('/otp/email', sendEmailOTP);

// @route   POST /api/auth/otp/mobile
// @desc    Send OTP to mobile
// @access  Public
router.post('/otp/mobile', sendMobileOTP);

// @route   POST /api/auth/otp/verify-email
// @desc    Verify email OTP
// @access  Public
router.post('/otp/verify-email', verifyEmailOTP);

// @route   POST /api/auth/otp/verify-mobile
// @desc    Verify mobile OTP
// @access  Public
router.post('/otp/verify-mobile', verifyMobileOTP);

export default router;
