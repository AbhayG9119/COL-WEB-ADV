import express from 'express';
import { login, signup } from '../controllers/authController.js';

const router = express.Router();

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', login);

// @route   POST /api/auth/student/signup
// @desc    Register a new student
// @access  Public
router.post('/student/signup', signup);

export default router;
