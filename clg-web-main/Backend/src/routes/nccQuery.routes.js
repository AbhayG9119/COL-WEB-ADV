import express from 'express';
import NCCQuery from '../models/NCCQuery.js';
import adminAuthMiddleware from '../middleware/adminAuthMiddleware.js';

const router = express.Router({
  strict: true
});

// Apply admin authentication middleware to admin routes
router.use(adminAuthMiddleware);

// Submit NCC query form
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, course, message } = req.body;
    const nccQuery = new NCCQuery({ name, email, phone, course, message });
    await nccQuery.save();

    res.status(201).json({ message: 'NCC query submitted successfully' });
  } catch (error) {
    console.error('Error submitting NCC query:', error.message);
    res.status(500).json({ message: 'Failed to submit NCC query. Please try again.' });
  }
});

// Get all NCC queries with pagination and search (admin only)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    const searchRegex = new RegExp(search, 'i');
    const query = search ? {
      $or: [
        { name: searchRegex },
        { email: searchRegex },
        { course: searchRegex },
        { message: searchRegex }
      ]
    } : {};

    const total = await NCCQuery.countDocuments(query);
    const queries = await NCCQuery.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: queries,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
