import express from 'express';
import auth from '../middleware/authMiddleware.js';
import roleAuth from '../middleware/roleAuth.js';
import Event from '../models/Event.js';
import Student from '../models/Student.js';
import Faculty from '../models/Faculty.js';
import Attendance from '../models/Attendance.js';

const router = express.Router();

// Middleware to allow only Faculty role
router.use(auth, roleAuth(['faculty']));

// Helper function for error handling
const handleError = (res, error, message = 'Server error', statusCode = 500) => {
  console.error(error);
  res.status(statusCode).json({ message, error: error.message });
};

// Helper function to validate required fields
const validateRequiredFields = (fields, reqBody) => {
  const missingFields = fields.filter(field => !reqBody[field]);
  if (missingFields.length > 0) {
    return { isValid: false, message: `Missing required fields: ${missingFields.join(', ')}` };
  }
  return { isValid: true };
};

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
    const studentIds = attendanceRecords.map(r => r.studentId);
    const existingRecords = await Attendance.find({
      date: attendanceDate,
      subject,
      studentId: { $in: studentIds }
    });

    if (existingRecords.length > 0) {
      return res.status(400).json({ message: 'Attendance already marked for some students on this date and subject' });
    }

    // Fetch students to get their departments
    const students = await Student.find({ _id: { $in: studentIds } }).select('department');
    const studentMap = students.reduce((map, student) => {
      map[student._id.toString()] = student.department;
      return map;
    }, {});

    const records = attendanceRecords.map(record => ({
      studentId: record.studentId,
      date: attendanceDate,
      subject,
      status: record.status,
      department: studentMap[record.studentId] || 'Unknown'
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

// Get a specific attendance record
router.get('/attendance/:id', async (req, res) => {
  try {
    const record = await Attendance.findById(req.params.id).populate('studentId', 'username studentId department');
    if (!record) return res.status(404).json({ message: 'Attendance record not found' });

    // Check if faculty belongs to student's department (if both have departments set)
    const student = record.studentId;
    if (student && student.department && req.user.department) {
      if (student.department !== req.user.department) {
        return res.status(403).json({ message: 'Unauthorized - Department mismatch' });
      }
    }

    res.json(record);
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

    // Check if faculty belongs to student's department (if both have departments set)
    const student = await Student.findById(record.studentId);
    if (student && student.department && req.user.department) {
      if (student.department !== req.user.department) {
        return res.status(403).json({ message: 'Unauthorized - Department mismatch' });
      }
    }

    record.status = status;
    await record.save();
    res.json(record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all students from admin (for attendance marking)
router.get('/students/all', async (req, res) => {
  try {
    const students = await Student.find({}).select('-password').sort({ username: 1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get students by department (for attendance marking)
router.get('/students/department/:department', async (req, res) => {
  try {
    const { department } = req.params;
    const students = await Student.find({ department }).select('-password').sort({ username: 1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Bulk mark attendance for multiple students
router.post('/attendance/bulk', async (req, res) => {
  try {
    const { date, subject, attendanceRecords } = req.body; // attendanceRecords: [{ studentId, status }]

    const attendanceDate = new Date(date);
    const studentIds = attendanceRecords.map(r => r.studentId);

    // Check if attendance already marked for these students on this date and subject
    const existingRecords = await Attendance.find({
      date: attendanceDate,
      subject,
      studentId: { $in: studentIds }
    });

    if (existingRecords.length > 0) {
      return res.status(400).json({
        message: 'Attendance already marked for some students on this date and subject',
        existingRecords: existingRecords.length
      });
    }

    // Fetch students to get their departments
    const students = await Student.find({ _id: { $in: studentIds } }).select('department');
    const studentMap = students.reduce((map, student) => {
      map[student._id.toString()] = student.department;
      return map;
    }, {});

    const records = attendanceRecords.map(record => ({
      studentId: record.studentId,
      date: attendanceDate,
      subject,
      status: record.status,
      department: studentMap[record.studentId] || 'Unknown'
    }));

    await Attendance.insertMany(records);
    res.status(201).json({
      message: 'Bulk attendance marked successfully',
      recordsCreated: records.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get attendance statistics for department
router.get('/attendance/statistics', async (req, res) => {
  try {
    const { date, subject, department } = req.query;

    let matchFilter = {};

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      matchFilter.date = { $gte: startDate, $lte: endDate };
    }

    if (subject) {
      matchFilter.subject = subject;
    }

    if (department) {
      matchFilter.department = department;
    }

    const stats = await Attendance.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const total = stats.reduce((sum, stat) => sum + stat.count, 0);
    const presentCount = stats.find(s => s._id === 'present')?.count || 0;
    const absentCount = stats.find(s => s._id === 'absent')?.count || 0;
    const lateCount = stats.find(s => s._id === 'late')?.count || 0;

    res.json({
      total,
      present: presentCount,
      absent: absentCount,
      late: lateCount,
      presentPercentage: total > 0 ? Math.round((presentCount / total) * 100) : 0,
      absentPercentage: total > 0 ? Math.round((absentCount / total) * 100) : 0,
      latePercentage: total > 0 ? Math.round((lateCount / total) * 100) : 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get attendance records with student details
router.get('/attendance/detailed', async (req, res) => {
  try {
    const { date, subject, department } = req.query;

    let matchFilter = {};

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      matchFilter.date = { $gte: startDate, $lte: endDate };
    }

    if (subject) {
      matchFilter.subject = subject;
    }

    if (department) {
      matchFilter.department = department;
    }

    const records = await Attendance.find(matchFilter)
      .populate('studentId', 'username email studentId department profilePicture')
      .sort({ date: -1, subject: 1 });

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get day-wise attendance records for faculty's department
router.get('/attendance/day-wise', async (req, res) => {
  try {
    console.log('Day-wise attendance request received');
    console.log('User:', req.user._id, 'Department:', req.user.department);

    // Validate user and department
    if (!req.user || !req.user.department) {
      console.error('Invalid user or missing department');
      return res.status(400).json({ message: 'Invalid user or missing department' });
    }

    const { startDate, endDate } = req.query;

    // Always filter by faculty's department
    const matchFilter = { department: req.user.department };
    console.log('Initial filter:', matchFilter);

    // Handle date parameters with proper defaults
    if (startDate && endDate) {
      matchFilter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else if (startDate) {
      const start = new Date(startDate);
      const end = new Date(start);
      end.setDate(end.getDate() + 7); // Default to 7 days if no end date
      matchFilter.date = { $gte: start, $lte: end };
    } else {
      // Default to last 7 days
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 7);
      matchFilter.date = { $gte: start, $lte: end };
    }

    console.log('Final filter:', matchFilter);

    // Get all attendance records for the date range and department
    const records = await Attendance.find(matchFilter)
      .populate('studentId', 'username email studentId department profilePicture')
      .sort({ date: 1, subject: 1 });

    console.log('Found records:', records.length);

    // If no records found, return empty array instead of error
    if (records.length === 0) {
      console.log('No attendance records found for the specified criteria');
      return res.json([]);
    }

    // Group records by date
    const dayWiseRecords = records.reduce((acc, record) => {
      const dateKey = record.date.toISOString().split('T')[0]; // YYYY-MM-DD format

      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: dateKey,
          records: [],
          summary: {
            total: 0,
            present: 0,
            absent: 0,
            late: 0
          }
        };
      }

      acc[dateKey].records.push(record);

      // Update summary
      acc[dateKey].summary.total++;
      if (record.status === 'present') acc[dateKey].summary.present++;
      else if (record.status === 'absent') acc[dateKey].summary.absent++;
      else if (record.status === 'late') acc[dateKey].summary.late++;

      return acc;
    }, {});

    console.log('Grouped records:', Object.keys(dayWiseRecords));

    // Convert to array and sort by date (most recent first)
    const result = Object.values(dayWiseRecords).sort((a, b) => new Date(b.date) - new Date(a.date));

    console.log('Final result length:', result.length);
    res.json(result);
  } catch (error) {
    console.error('Error in day-wise attendance:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
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
