import express from 'express';
import { getProfile, updateProfile } from '../controllers/studentController.js';

const router = express.Router();

// @route   GET /api/student/profile
// @desc    Get student profile
// @access  Private (Student)
router.get('/profile', getProfile);

// @route   PUT /api/student/profile
// @desc    Update student profile
// @access  Private (Student)
router.put('/profile', updateProfile);

export default router;
