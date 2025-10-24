import express from 'express';
import { protect } from '../middleware/auth.js';
import { getUsers, addUser, editUser, deleteUser, resetPassword } from '../controllers/userController.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use((req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
  next();
});

// @route   GET /api/users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/', getUsers);

// @route   POST /api/users
// @desc    Add new user
// @access  Private (Admin only)
router.post('/', addUser);

// @route   POST /api/users/staff/register
// @desc    Register new staff
// @access  Private (Admin only)
router.post('/staff/register', addUser);

// @route   PUT /api/users/:id/:role
// @desc    Edit user
// @access  Private (Admin only)
router.put('/:id/:role', editUser);

// @route   DELETE /api/users/:id/:role
// @desc    Delete user
// @access  Private (Admin only)
router.delete('/:id/:role', deleteUser);

// @route   PUT /api/users/reset-password/:id/:role
// @desc    Reset user password
// @access  Private (Admin only)
router.put('/reset-password/:id/:role', resetPassword);

export default router;
