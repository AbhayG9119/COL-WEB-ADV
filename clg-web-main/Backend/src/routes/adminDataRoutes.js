import express from 'express';
import bcrypt from 'bcrypt';
import multer from 'multer';
import path from 'path';
import Contact from '../models/Contact.js';
import AdmissionQuery from '../models/AdmissionQuery.js';
import NCCQuery from '../models/NCCQuery.js';
import Event from '../models/Event.js';
import Course from '../models/Course.js';
import Hod from '../models/Hod.js';
import Student from '../models/Student.js';
import Faculty from '../models/Faculty.js';
import DetailedStudentProfile from '../models/DetailedStudentProfile.js';
import Attendance from '../models/Attendance.js';
import Form from '../models/formModel.js';
import adminAuthMiddleware from '../middleware/adminAuthMiddleware.js';

const router = express.Router();

// Apply admin authentication middleware to all routes
router.use(adminAuthMiddleware);

// Configure multer for profile picture uploads
const profilePictureStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profile-pictures/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, req.params.id + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadProfilePicture = multer({
  storage: profilePictureStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, JPG, PNG, WEBP allowed for profile pictures.'));
    }
  }
});

// Get all contacts with pagination and search
router.get('/contacts', async (req, res) => {
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
        { subject: searchRegex }
      ]
    } : {};

    const total = await Contact.countDocuments(query);
    const contacts = await Contact.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: contacts,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get contact statistics
router.get('/stats', async (req, res) => {
  try {
    const totalContacts = await Contact.countDocuments();
    const todayContacts = await Contact.countDocuments({
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0))
      }
    });

    res.json({
      success: true,
      data: {
        totalContacts,
        todayContacts
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get all admission queries with pagination and search
router.get('/admission-queries', async (req, res) => {
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

    const total = await AdmissionQuery.countDocuments(query);
    const queries = await AdmissionQuery.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
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
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get admission query statistics
router.get('/admission-queries/stats', async (req, res) => {
  try {
    const totalQueries = await AdmissionQuery.countDocuments();
    const todayQueries = await AdmissionQuery.countDocuments({
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0))
      }
    });

    res.json({
      success: true,
      data: {
        totalQueries,
        todayQueries
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get all NCC queries with pagination and search
router.get('/ncc-queries', async (req, res) => {
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
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get NCC query statistics
router.get('/ncc-queries/stats', async (req, res) => {
  try {
    const totalQueries = await NCCQuery.countDocuments();
    const todayQueries = await NCCQuery.countDocuments({
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0))
      }
    });

    res.json({
      success: true,
      data: {
        totalQueries,
        todayQueries
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get all events sorted by newest first
router.get('/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get all courses
router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get all hods
router.get('/hods', async (req, res) => {
  try {
    const hods = await Hod.find();
    res.json({
      success: true,
      count: hods.length,
      data: hods
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get all students
router.get('/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get all faculty
router.get('/faculty', async (req, res) => {
  try {
    const faculty = await Faculty.find();
    res.json({
      success: true,
      count: faculty.length,
      data: faculty
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get faculty statistics
router.get('/faculty/stats', async (req, res) => {
  try {
    const totalFaculty = await Faculty.countDocuments();
    const todayFaculty = await Faculty.countDocuments({
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0))
      }
    });

    res.json({
      success: true,
      data: {
        totalFaculty,
        todayFaculty
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get single faculty by ID
router.get('/faculty/:id', async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty not found'
      });
    }
    res.json({
      success: true,
      data: faculty
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Update faculty by ID
router.put('/faculty/:id', async (req, res) => {
  try {
    const updates = req.body;

    // If password is being updated, hash it
    if (updates.password) {
      const salt = await bcrypt.genSalt(12);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    const faculty = await Faculty.findByIdAndUpdate(req.params.id, updates, { new: true });

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty not found'
      });
    }

    res.json({
      success: true,
      data: faculty,
      message: 'Faculty updated successfully'
    });
  } catch (error) {
    if (error.code === 11000) { // Duplicate key error
      res.status(400).json({
        success: false,
        message: 'Username or email already exists'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
});

// Delete faculty by ID
router.delete('/faculty/:id', async (req, res) => {
  try {
    const faculty = await Faculty.findByIdAndDelete(req.params.id);

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty not found'
      });
    }

    res.json({
      success: true,
      message: 'Faculty deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Upload profile picture for faculty
router.post('/faculty/:id/upload-picture', uploadProfilePicture.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const faculty = await Faculty.findByIdAndUpdate(
      req.params.id,
      { profilePicture: req.file.filename },
      { new: true }
    );

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty not found'
      });
    }

    res.json({
      success: true,
      data: faculty,
      message: 'Profile picture uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get all student profiles with detailed information for admin
router.get('/student-profiles', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    const searchRegex = new RegExp(search, 'i');
    const query = search ? {
      $or: [
        { 'student.username': searchRegex },
        { 'student.email': searchRegex },
        { rollNumber: searchRegex },
        { course: searchRegex },
        { branch: searchRegex }
      ]
    } : {};

    const total = await DetailedStudentProfile.countDocuments(query);
    const profiles = await DetailedStudentProfile.find(query)
      .populate('student', 'username email studentId department')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: profiles,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Error fetching student profiles:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get student profile statistics
router.get('/student-profiles/stats', async (req, res) => {
  try {
    const totalProfiles = await DetailedStudentProfile.countDocuments();
    const todayProfiles = await DetailedStudentProfile.countDocuments({
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0))
      }
    });

    // Get course-wise statistics
    const courseStats = await DetailedStudentProfile.aggregate([
      { $group: { _id: '$course', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        totalProfiles,
        todayProfiles,
        courseStats
      }
    });
  } catch (error) {
    console.error('Error fetching student profile statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// ===== ENHANCED FORM MANAGEMENT ENDPOINTS =====

// Reply to contact form
router.post('/contacts/:id/reply', async (req, res) => {
  try {
    const { id } = req.params;
    const { replyMessage } = req.body;

    const contact = await Contact.findByIdAndUpdate(
      id,
      {
        replyMessage,
        repliedAt: new Date(),
        status: 'replied'
      },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      message: 'Reply sent successfully',
      data: contact
    });
  } catch (error) {
    console.error('Error replying to contact:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Archive contact form
router.put('/contacts/:id/archive', async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findByIdAndUpdate(
      id,
      { status: 'archived' },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact archived successfully',
      data: contact
    });
  } catch (error) {
    console.error('Error archiving contact:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Delete contact form
router.delete('/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Update admission query status
router.put('/admission-queries/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // pending, in-progress, resolved, rejected

    const validStatuses = ['pending', 'in-progress', 'resolved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: pending, in-progress, resolved, rejected'
      });
    }

    const query = await AdmissionQuery.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!query) {
      return res.status(404).json({
        success: false,
        message: 'Admission query not found'
      });
    }

    res.json({
      success: true,
      message: 'Query status updated successfully',
      data: query
    });
  } catch (error) {
    console.error('Error updating admission query status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Respond to admission query
router.post('/admission-queries/:id/respond', async (req, res) => {
  try {
    const { id } = req.params;
    const { response } = req.body;

    const query = await AdmissionQuery.findByIdAndUpdate(
      id,
      {
        response,
        respondedAt: new Date(),
        status: 'resolved'
      },
      { new: true }
    );

    if (!query) {
      return res.status(404).json({
        success: false,
        message: 'Admission query not found'
      });
    }

    res.json({
      success: true,
      message: 'Response sent successfully',
      data: query
    });
  } catch (error) {
    console.error('Error responding to admission query:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Archive admission query
router.put('/admission-queries/:id/archive', async (req, res) => {
  try {
    const { id } = req.params;

    const query = await AdmissionQuery.findByIdAndUpdate(
      id,
      { status: 'archived' },
      { new: true }
    );

    if (!query) {
      return res.status(404).json({
        success: false,
        message: 'Admission query not found'
      });
    }

    res.json({
      success: true,
      message: 'Query archived successfully',
      data: query
    });
  } catch (error) {
    console.error('Error archiving admission query:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Delete admission query
router.delete('/admission-queries/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const query = await AdmissionQuery.findByIdAndDelete(id);

    if (!query) {
      return res.status(404).json({
        success: false,
        message: 'Admission query not found'
      });
    }

    res.json({
      success: true,
      message: 'Query deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting admission query:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Update NCC query status
router.put('/ncc-queries/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // pending, in-progress, resolved, rejected

    const validStatuses = ['pending', 'in-progress', 'resolved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: pending, in-progress, resolved, rejected'
      });
    }

    const query = await NCCQuery.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!query) {
      return res.status(404).json({
        success: false,
        message: 'NCC query not found'
      });
    }

    res.json({
      success: true,
      message: 'Query status updated successfully',
      data: query
    });
  } catch (error) {
    console.error('Error updating NCC query status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Respond to NCC query
router.post('/ncc-queries/:id/respond', async (req, res) => {
  try {
    const { id } = req.params;
    const { response } = req.body;

    const query = await NCCQuery.findByIdAndUpdate(
      id,
      {
        response,
        respondedAt: new Date(),
        status: 'resolved'
      },
      { new: true }
    );

    if (!query) {
      return res.status(404).json({
        success: false,
        message: 'NCC query not found'
      });
    }

    res.json({
      success: true,
      message: 'Response sent successfully',
      data: query
    });
  } catch (error) {
    console.error('Error responding to NCC query:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Archive NCC query
router.put('/ncc-queries/:id/archive', async (req, res) => {
  try {
    const { id } = req.params;

    const query = await NCCQuery.findByIdAndUpdate(
      id,
      { status: 'archived' },
      { new: true }
    );

    if (!query) {
      return res.status(404).json({
        success: false,
        message: 'NCC query not found'
      });
    }

    res.json({
      success: true,
      message: 'Query archived successfully',
      data: query
    });
  } catch (error) {
    console.error('Error archiving NCC query:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Delete NCC query
router.delete('/ncc-queries/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const query = await NCCQuery.findByIdAndDelete(id);

    if (!query) {
      return res.status(404).json({
        success: false,
        message: 'NCC query not found'
      });
    }

    res.json({
      success: true,
      message: 'Query deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting NCC query:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Export contacts as CSV
router.get('/contacts/export', async (req, res) => {
  try {
    const format = req.query.format || 'csv';
    const contacts = await Contact.find().sort({ createdAt: -1 });

    if (format === 'csv') {
      const csvData = contacts.map(contact => ({
        Name: contact.name || '',
        Email: contact.email || '',
        Phone: contact.phone || '',
        Location: contact.location || '',
        Subject: contact.subject || '',
        Message: contact.message || '',
        'Reply Message': contact.replyMessage || '',
        Status: contact.status || 'pending',
        'Created Date': contact.createdAt.toISOString().split('T')[0],
        'Replied Date': contact.repliedAt ? contact.repliedAt.toISOString().split('T')[0] : ''
      }));

      const csvContent = [
        Object.keys(csvData[0]).join(','),
        ...csvData.map(row => Object.values(row).map(val => `"${val}"`).join(','))
      ].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=contacts.csv');
      res.send(csvContent);
    } else {
      res.status(400).json({
        success: false,
        message: 'Unsupported export format'
      });
    }
  } catch (error) {
    console.error('Error exporting contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Export admission queries as CSV
router.get('/admission-queries/export', async (req, res) => {
  try {
    const format = req.query.format || 'csv';
    const queries = await AdmissionQuery.find().sort({ createdAt: -1 });

    if (format === 'csv') {
      const csvData = queries.map(query => ({
        Name: query.name || '',
        Email: query.email || '',
        Course: query.course || '',
        Query: query.query || '',
        Response: query.response || '',
        Status: query.status || 'pending',
        'Created Date': query.createdAt.toISOString().split('T')[0],
        'Responded Date': query.respondedAt ? query.respondedAt.toISOString().split('T')[0] : ''
      }));

      const csvContent = [
        Object.keys(csvData[0]).join(','),
        ...csvData.map(row => Object.values(row).map(val => `"${val}"`).join(','))
      ].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=admission-queries.csv');
      res.send(csvContent);
    } else {
      res.status(400).json({
        success: false,
        message: 'Unsupported export format'
      });
    }
  } catch (error) {
    console.error('Error exporting admission queries:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Export NCC queries as CSV
router.get('/ncc-queries/export', async (req, res) => {
  try {
    const format = req.query.format || 'csv';
    const queries = await NCCQuery.find().sort({ createdAt: -1 });

    if (format === 'csv') {
      const csvData = queries.map(query => ({
        Name: query.name || '',
        Email: query.email || '',
        Course: query.course || '',
        Message: query.message || '',
        Response: query.response || '',
        Status: query.status || 'pending',
        'Created Date': query.createdAt.toISOString().split('T')[0],
        'Responded Date': query.respondedAt ? query.respondedAt.toISOString().split('T')[0] : ''
      }));

      const csvContent = [
        Object.keys(csvData[0]).join(','),
        ...csvData.map(row => Object.values(row).map(val => `"${val}"`).join(','))
      ].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=ncc-queries.csv');
      res.send(csvContent);
    } else {
      res.status(400).json({
        success: false,
        message: 'Unsupported export format'
      });
    }
  } catch (error) {
    console.error('Error exporting NCC queries:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;