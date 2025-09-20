import express from 'express';
import auth from '../middleware/auth.js';
import roleAuth from '../middleware/roleAuth.js';
import Event from '../models/Event.js';
import AdminUser from '../models/AdminUser.js';

const router = express.Router();

// Middleware to allow only HOD role
router.use(auth, roleAuth(['hod']));

// Get department-specific events/notices
router.get('/events', async (req, res) => {
  try {
    const events = await Event.find({ department: req.user.department });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new event/notice
router.post('/events', async (req, res) => {
  try {
    const { title, description, date, time, venue, organizer } = req.body;
    const event = new Event({
      title,
      description,
      department: req.user.department,
      date,
      time,
      venue,
      organizer,
      createdBy: req.user._id,
    });
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Approve or reject departmental activities
router.patch('/events/:id/approve', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.department !== req.user.department) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    event.status = req.body.status; // 'approved' or 'rejected'
    event.approvedBy = req.user._id;
    await event.save();
    res.json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// View department student list
router.get('/students', async (req, res) => {
  try {
    const students = await AdminUser.find({ role: 'student', department: req.user.department });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
