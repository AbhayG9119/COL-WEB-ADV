import express from 'express';
import auth from '../middleware/authMiddleware.js';
import roleAuth from '../middleware/roleAuth.js';
import Event from '../models/Event.js';
import Student from '../models/Student.js';
import Attendance from '../models/Attendance.js';

const router = express.Router();

// Middleware to allow only Faculty role
router.use(auth, roleAuth(['faculty']));

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
    const students = await Student.find({ department: req.user.department }).select('-password');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark attendance for students
router.post('/attendance', async (req, res) => {
  try {
    const { date, subject, attendanceRecords } = req.body; // attendanceRecords: [{ studentId, status }]

    const attendanceDate = new Date(date);
    const existingRecords = await Attendance.find({
      date: attendanceDate,
      subject,
      studentId: { $in: attendanceRecords.map(r => r.studentId) }
    });

    if (existingRecords.length > 0) {
      return res.status(400).json({ message: 'Attendance already marked for some students on this date and subject' });
    }

    const records = attendanceRecords.map(record => ({
      studentId: record.studentId,
      date: attendanceDate,
      subject,
      status: record.status
    }));

    await Attendance.insertMany(records);
    res.status(201).json({ message: 'Attendance marked successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get attendance records for department (for faculty to view)
router.get('/attendance', async (req, res) => {
  try {
    const { date, subject } = req.query;
    const filter = { department: req.user.department };

    if (date) filter.date = new Date(date);
    if (subject) filter.subject = subject;

    const records = await Attendance.find(filter)
      .populate('studentId', 'username studentId')
      .sort({ date: -1 });

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update attendance record
router.put('/attendance/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const record = await Attendance.findById(req.params.id);
    if (!record) return res.status(404).json({ message: 'Attendance record not found' });

    // Check if faculty belongs to student's department
    const student = await Student.findById(record.studentId);
    if (student.department !== req.user.department) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    record.status = status;
    await record.save();
    res.json(record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update faculty details (department, subject)
router.patch('/profile', async (req, res) => {
  try {
    const { department, subject } = req.body;
    const faculty = await Faculty.findById(req.user._id);
    if (!faculty) return res.status(404).json({ message: 'Faculty not found' });

    if (department) faculty.department = department;
    if (subject) faculty.subject = subject;
    await faculty.save();
    res.json({ message: 'Profile updated successfully', faculty });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
