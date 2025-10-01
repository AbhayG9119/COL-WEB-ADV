import express from 'express';
import auth from '../middleware/authMiddleware.js';
import roleAuth from '../middleware/roleAuth.js';
import Event from '../models/Event.js';
import Student from '../models/Student.js';
import Faculty from '../models/Faculty.js';
import Attendance from '../models/Attendance.js';
import StudyMaterial from '../models/StudyMaterial.js';
import Result from '../models/Result.js';
import DetailedStudentProfile from '../models/DetailedStudentProfile.js';
import Document from '../models/Document.js';
import Course from '../models/Course.js';
import Notification from '../models/Notification.js';
import Task from '../models/Task.js';
import CommunicationTemplate from '../models/CommunicationTemplate.js';
import { uploadDocument, uploadDocuments, uploadStudyMaterial, uploadFacultyProfilePic, handleUploadError } from '../middleware/fileUpload.js';
import fs from 'fs';
import path from 'path';

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

// Helper function to check department access
const checkDepartmentAccess = (req, resourceDepartment) => {
  if (!req.user || !req.user.department) {
    return { authorized: false, message: 'User department not found' };
  }
  if (req.user.department !== resourceDepartment) {
    return { authorized: false, message: `Access denied. Faculty department (${req.user.department}) does not match resource department (${resourceDepartment})` };
  }
  return { authorized: true };
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

    // Fetch students to get their departments and validate access
    const students = await Student.find({ _id: { $in: studentIds } }).select('department');
    const studentMap = students.reduce((map, student) => {
      map[student._id.toString()] = student.department;
      return map;
    }, {});

    // Check if all students belong to faculty's department
    for (const record of attendanceRecords) {
      const studentDept = studentMap[record.studentId];
      if (!studentDept) {
        return res.status(404).json({ message: `Student ${record.studentId} not found` });
      }
      const accessCheck = checkDepartmentAccess({ user: req.user }, studentDept);
      if (!accessCheck.authorized) {
        return res.status(403).json({ message: accessCheck.message });
      }
    }

    const existingRecords = await Attendance.find({
      date: attendanceDate,
      subject,
      studentId: { $in: studentIds }
    });

    if (existingRecords.length > 0) {
      return res.status(400).json({ message: 'Attendance already marked for some students on this date and subject' });
    }

    const records = attendanceRecords.map(record => ({
      studentId: record.studentId,
      date: attendanceDate,
      subject,
      status: record.status,
      department: studentMap[record.studentId]
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

    // Check if faculty belongs to student's department
    const accessCheck = checkDepartmentAccess({ user: req.user }, record.studentId.department);
    if (!accessCheck.authorized) {
      return res.status(403).json({ message: accessCheck.message });
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

    let matchFilter = { department: req.user.department };

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

    let matchFilter = { department: req.user.department };

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

// Update faculty profile
router.put('/profile', async (req, res) => {
  try {
    const updateData = req.body;

    // Validate phone number if provided
    if (updateData.mobileNumber && !/^\d{10}$/.test(updateData.mobileNumber)) {
      return res.status(400).json({
        message: 'Mobile number must be exactly 10 digits'
      });
    }

    // Convert array fields from comma-separated strings if needed
    if (updateData.subjectsTaught && typeof updateData.subjectsTaught === 'string') {
      updateData.subjectsTaught = updateData.subjectsTaught.split(',').map(item => item.trim()).filter(item => item);
    }
    if (updateData.specialization && typeof updateData.specialization === 'string') {
      updateData.specialization = updateData.specialization.split(',').map(item => item.trim()).filter(item => item);
    }
    if (updateData.researchInterests && typeof updateData.researchInterests === 'string') {
      updateData.researchInterests = updateData.researchInterests.split(',').map(item => item.trim()).filter(item => item);
    }
    if (updateData.publications && typeof updateData.publications === 'string') {
      updateData.publications = updateData.publications.split(',').map(item => item.trim()).filter(item => item);
    }
    if (updateData.certifications && typeof updateData.certifications === 'string') {
      updateData.certifications = updateData.certifications.split(',').map(item => item.trim()).filter(item => item);
    }
    if (updateData.achievements && typeof updateData.achievements === 'string') {
      updateData.achievements = updateData.achievements.split(',').map(item => item.trim()).filter(item => item);
    }
    if (updateData.administrativeRoles && typeof updateData.administrativeRoles === 'string') {
      updateData.administrativeRoles = updateData.administrativeRoles.split(',').map(item => item.trim()).filter(item => item);
    }

    // Convert dateOfJoining to Date if provided
    if (updateData.dateOfJoining) {
      updateData.dateOfJoining = new Date(updateData.dateOfJoining);
    }

    const faculty = await Faculty.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!faculty) return res.status(404).json({ message: 'Faculty not found' });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      faculty
    });
  } catch (error) {
    console.error('Error updating faculty profile:', error);

    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation error: ' + Object.values(error.errors).map(err => err.message).join(', ')
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Duplicate value error. Employee ID or email may already exist.'
      });
    }

    res.status(500).json({ message: 'Server error' });
  }
});

// Get faculty profile
router.get('/profile', async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.user._id).select('-password');

    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    // Get additional statistics
    const eventsCount = await Event.countDocuments({ createdBy: req.user._id });
    const departmentStudents = await Student.countDocuments({ department: req.user.department });

    const profile = {
      ...faculty.toObject(),
      stats: {
        eventsCreated: eventsCount,
        departmentStudents: departmentStudents
      }
    };

    res.json(profile);
  } catch (error) {
    console.error('Error fetching faculty profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete faculty account (only for the faculty themselves)
router.delete('/profile', async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.user._id);

    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    // Check if faculty has created any events
    const eventsCount = await Event.countDocuments({ createdBy: req.user._id });

    if (eventsCount > 0) {
      return res.status(409).json({
        message: `Cannot delete account. You have created ${eventsCount} event(s). Please delete them first or transfer ownership.`
      });
    }

    // Delete associated records
    await Promise.all([
      Event.deleteMany({ createdBy: req.user._id })
    ]);

    // Delete the faculty account
    await Faculty.findByIdAndDelete(req.user._id);

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting faculty account:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload profile picture
router.post('/profile/picture', uploadFacultyProfilePic, handleUploadError, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Get current faculty to check for existing profile picture
    const currentFaculty = await Faculty.findById(req.user._id);
    if (!currentFaculty) return res.status(404).json({ message: 'Faculty not found' });

    // Delete old profile picture if exists
    if (currentFaculty.profilePicture) {
      const oldFilePath = path.join('uploads/profile-pictures', path.basename(currentFaculty.profilePicture));
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    // Update faculty profile with new profile picture URL (multer already saved the file)
    const faculty = await Faculty.findByIdAndUpdate(
      req.user._id,
      { profilePicture: `/uploads/profile-pictures/${req.file.filename}` },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile picture uploaded successfully',
      profilePicture: faculty.profilePicture
    });
  } catch (error) {
    console.error('Error uploading profile picture:', error);

    // Handle specific multer errors
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 2MB for profile pictures.' });
    }
    if (error.code === 'ENOENT') {
      return res.status(500).json({ message: 'Upload directory not found. Please contact administrator.' });
    }

    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Upload faculty documents
router.post('/profile/documents', auth, roleAuth(['faculty']), uploadDocuments, handleUploadError, async (req, res) => {
  try {
    console.log('req.files received:', req.files);
    if (!req.files) {
      console.log('No files uploaded');
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const uploadedFiles = req.files;
    const faculty = await Faculty.findById(req.user._id);

    if (!faculty) return res.status(404).json({ message: 'Faculty not found' });

    // Create uploads directory if it doesn't exist
    const uploadDir = 'uploads/faculty-documents';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const documentUrls = {};

    // Process each uploaded file
    if (uploadedFiles.idProof && uploadedFiles.idProof[0]) {
      const file = uploadedFiles.idProof[0];
      const fileName = `${req.user._id}-idProof-${Date.now()}-${file.originalname}`;
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, file.buffer);
      documentUrls.idProof = `/uploads/faculty-documents/${fileName}`;
    }

    if (uploadedFiles.appointmentLetter && uploadedFiles.appointmentLetter[0]) {
      const file = uploadedFiles.appointmentLetter[0];
      const fileName = `${req.user._id}-appointmentLetter-${Date.now()}-${file.originalname}`;
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, file.buffer);
      documentUrls.appointmentLetter = `/uploads/faculty-documents/${fileName}`;
    }

    if (uploadedFiles.qualificationCertificates) {
      documentUrls.qualificationCertificates = [];
      uploadedFiles.qualificationCertificates.forEach((file, index) => {
        const fileName = `${req.user._id}-qualification-${index}-${Date.now()}-${file.originalname}`;
        const filePath = path.join(uploadDir, fileName);
        fs.writeFileSync(filePath, file.buffer);
        documentUrls.qualificationCertificates.push(`/uploads/faculty-documents/${fileName}`);
      });
    }

    // Update faculty documents
    const updateData = {};
    if (documentUrls.idProof) updateData.idProof = documentUrls.idProof;
    if (documentUrls.appointmentLetter) updateData.appointmentLetter = documentUrls.appointmentLetter;
    if (documentUrls.qualificationCertificates) updateData.qualificationCertificates = documentUrls.qualificationCertificates;

    const updatedFaculty = await Faculty.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Documents uploaded successfully',
      documents: documentUrls
    });
  } catch (error) {
    console.error('Error uploading documents:', error);
    console.log('Error details:', error.stack);
    res.status(400).json({ message: 'Bad Request', error: error.message });
  }
});

// Get faculty statistics
router.get('/stats', async (req, res) => {
  try {
    const facultyId = req.user._id;
    const department = req.user.department;

    // Get counts
    const eventsCount = await Event.countDocuments({ createdBy: facultyId });
    const approvedEventsCount = await Event.countDocuments({
      createdBy: facultyId,
      status: 'approved'
    });
    const departmentStudents = await Student.countDocuments({ department });
    const attendanceRecords = await Attendance.countDocuments({ department });

    // Get recent activities
    const recentEvents = await Event.find({ createdBy: facultyId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title status createdAt');

    const recentAttendance = await Attendance.find({ department })
      .sort({ date: -1 })
      .limit(10)
      .populate('studentId', 'username studentId')
      .select('studentId date subject status');

    res.json({
      success: true,
      data: {
        events: {
          total: eventsCount,
          approved: approvedEventsCount,
          recent: recentEvents
        },
        students: {
          departmentTotal: departmentStudents
        },
        attendance: {
          totalRecords: attendanceRecords,
          recent: recentAttendance
        }
      }
    });
  } catch (error) {
    console.error('Error fetching faculty statistics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete an event
router.delete('/events/:id', async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found or you do not have permission to delete it' });
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update an event
router.put('/events/:id', async (req, res) => {
  try {
    const { title, description, date, time, venue, organizer } = req.body;

    const event = await Event.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found or you do not have permission to update it' });
    }

    // Update only provided fields
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (date) updateData.date = date;
    if (time) updateData.time = time;
    if (venue) updateData.venue = venue;
    if (organizer) updateData.organizer = organizer;

    Object.assign(event, updateData);
    await event.save();

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: event
    });
  } catch (error) {
    console.error('Error updating event:', error);

    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation error: ' + Object.values(error.errors).map(err => err.message).join(', ')
      });
    }

    res.status(500).json({ message: 'Server error' });
  }
});

// Delete attendance record
router.delete('/attendance/:id', async (req, res) => {
  try {
    const record = await Attendance.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    // Check if faculty belongs to student's department
    const student = await Student.findById(record.studentId);
    if (student && student.department && req.user.department) {
      if (student.department !== req.user.department) {
        return res.status(403).json({ message: 'Unauthorized - Department mismatch' });
      }
    }

    await Attendance.findByIdAndDelete(req.params.id);

    res.json({ message: 'Attendance record deleted successfully' });
  } catch (error) {
    console.error('Error deleting attendance record:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get attendance summary for a specific subject
router.get('/attendance/subject-summary/:subject', async (req, res) => {
  try {
    const { subject } = req.params;
    const { startDate, endDate } = req.query;

    let matchFilter = {
      department: req.user.department,
      subject: subject
    };

    if (startDate && endDate) {
      matchFilter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const summary = await Attendance.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: '$studentId',
          totalClasses: { $sum: 1 },
          presentCount: {
            $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] }
          },
          absentCount: {
            $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] }
          },
          lateCount: {
            $sum: { $cond: [{ $eq: ['$status', 'late'] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          studentId: '$_id',
          totalClasses: 1,
          presentCount: 1,
          absentCount: 1,
          lateCount: 1,
          attendancePercentage: {
            $multiply: [
              { $divide: ['$presentCount', '$totalClasses'] },
              100
            ]
          }
        }
      }
    ]);

    // Populate student details
    const studentIds = summary.map(s => s.studentId);
    const students = await Student.find({ _id: { $in: studentIds } })
      .select('username email studentId profilePicture');

    const studentMap = students.reduce((map, student) => {
      map[student._id.toString()] = student;
      return map;
    }, {});

    const result = summary.map(item => ({
      ...item,
      student: studentMap[item.studentId.toString()]
    }));

    res.json({
      success: true,
      data: result,
      summary: {
        totalStudents: summary.length,
        averageAttendance: summary.length > 0 ?
          summary.reduce((sum, item) => sum + item.attendancePercentage, 0) / summary.length : 0
      }
    });
  } catch (error) {
    console.error('Error fetching subject attendance summary:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload study material
router.post('/study-materials', uploadStudyMaterial, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = 'uploads/study-materials';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Save file to disk
    const fileName = `${Date.now()}-${req.file.originalname}`;
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, req.file.buffer);

    const studyMaterial = new StudyMaterial({
      title,
      description,
      fileUrl: `/uploads/study-materials/${fileName}`,
      fileName: req.file.originalname,
      department: req.user.department,
      course: req.user.department,
      uploadedBy: req.user._id
    });

    await studyMaterial.save();

    res.status(201).json({
      success: true,
      message: 'Study material uploaded successfully',
      data: studyMaterial
    });
  } catch (error) {
    console.error('Error uploading study material:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get study materials for department
router.get('/study-materials', async (req, res) => {
  try {
    const materials = await StudyMaterial.find({ department: req.user.department })
      .populate('uploadedBy', 'username email')
      .sort({ uploadedAt: -1 });

    res.json({
      success: true,
      data: materials
    });
  } catch (error) {
    console.error('Error fetching study materials:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete study material
router.delete('/study-materials/:id', async (req, res) => {
  try {
    const material = await StudyMaterial.findOne({
      _id: req.params.id,
      uploadedBy: req.user._id
    });

    if (!material) {
      return res.status(404).json({ message: 'Study material not found or you do not have permission to delete it' });
    }

    // Delete file from disk
    const filePath = path.join('uploads/study-materials', path.basename(material.fileUrl));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await StudyMaterial.findByIdAndDelete(req.params.id);

    res.json({ message: 'Study material deleted successfully' });
  } catch (error) {
    console.error('Error deleting study material:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Result Management Routes

// Get all results for faculty's department
router.get('/results', async (req, res) => {
  try {
    const { studentId, subject, category, semester, year } = req.query;
    const filter = { department: req.user.department };

    if (studentId) filter.studentId = studentId;
    if (subject) filter.subject = subject;
    if (category) filter.category = category;
    if (semester) filter.semester = semester;
    if (year) filter.year = year;

    const results = await Result.find(filter)
      .populate('studentId', 'username studentId department')
      .populate('facultyId', 'username department')
      .sort({ date: -1 });

    res.json(results);
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get results for a specific student
router.get('/results/student/:studentId', async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);
    if (!student || student.department !== req.user.department) {
      return res.status(403).json({ message: 'Unauthorized - Student not in your department' });
    }

    const results = await Result.find({ studentId: req.params.studentId })
      .populate('facultyId', 'username department')
      .sort({ date: -1 });

    res.json(results);
  } catch (error) {
    console.error('Error fetching student results:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new result
router.post('/results', async (req, res) => {
  try {
    const { studentId, subject, category, marks, maxMarks, grade, semester, year } = req.body;

    // Validate required fields
    if (!studentId || !subject || !category || marks === undefined || !maxMarks || !grade) {
      return res.status(400).json({ message: 'Missing required fields: studentId, subject, category, marks, maxMarks, grade' });
    }

    // Check if student is in faculty's department
    const student = await Student.findById(studentId);
    if (!student || student.department !== req.user.department) {
      return res.status(403).json({ message: 'Unauthorized - Student not in your department' });
    }

    // Check for duplicate result
    const existingResult = await Result.findOne({
      studentId,
      subject,
      category,
      semester,
      year
    });

    if (existingResult) {
      return res.status(400).json({ message: 'Result already exists for this student, subject, category, semester/year' });
    }

    const result = new Result({
      studentId,
      facultyId: req.user._id,
      subject,
      category,
      marks,
      maxMarks,
      grade,
      semester,
      year,
      department: req.user.department
    });

    await result.save();

    const populatedResult = await Result.findById(result._id)
      .populate('studentId', 'username studentId department');

    res.status(201).json({
      success: true,
      message: 'Result created successfully',
      data: populatedResult
    });
  } catch (error) {
    console.error('Error creating result:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error: ' + Object.values(error.errors).map(err => err.message).join(', ') });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Update result
router.put('/results/:id', async (req, res) => {
  try {
    const { marks, maxMarks, grade, semester, year } = req.body;

    const result = await Result.findById(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }

    // Check authorization - faculty must be the one who created it or same department
    if (result.facultyId.toString() !== req.user._id.toString() && result.department !== req.user.department) {
      return res.status(403).json({ message: 'Unauthorized - Cannot update this result' });
    }

    // Update only provided fields
    if (marks !== undefined) result.marks = marks;
    if (maxMarks !== undefined) result.maxMarks = maxMarks;
    if (grade) result.grade = grade;
    if (semester !== undefined) result.semester = semester;
    if (year !== undefined) result.year = year;

    await result.save();

    const populatedResult = await Result.findById(result._id)
      .populate('studentId', 'username studentId department');

    res.json({
      success: true,
      message: 'Result updated successfully',
      data: populatedResult
    });
  } catch (error) {
    console.error('Error updating result:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error: ' + Object.values(error.errors).map(err => err.message).join(', ') });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete result
router.delete('/results/:id', async (req, res) => {
  try {
    const result = await Result.findById(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }

    // Check authorization
    if (result.facultyId.toString() !== req.user._id.toString() && result.department !== req.user.department) {
      return res.status(403).json({ message: 'Unauthorized - Cannot delete this result' });
    }

    await Result.findByIdAndDelete(req.params.id);

    res.json({ message: 'Result deleted successfully' });
  } catch (error) {
    console.error('Error deleting result:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get fees (placeholder - implement as needed)
router.get('/fees', async (req, res) => {
  try {
    // Placeholder implementation - return empty array for now
    res.json([]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all documents for faculty's department
router.get('/documents', async (req, res) => {
  try {
    // Get students from faculty's department with their documents
    const students = await Student.find({ department: req.user.department })
      .populate('documents.documentId')
      .select('username studentId department documents');

    if (students.length === 0) {
      return res.json({
        success: true,
        data: []
      });
    }

    // Group documents by student
    const studentDocuments = {};
    students.forEach(student => {
      const studentId = student._id.toString();
      studentDocuments[studentId] = {
        studentId: student.studentId,
        studentName: student.username,
        documents: []
      };
    });

    students.forEach(student => {
      const studentId = student._id.toString();

      // Process documents from the student's documents array
      student.documents.forEach(doc => {
        // Check if documentId exists (population might have failed)
        if (!doc.documentId) {
          console.warn(`Document reference missing for student ${studentId}, documentType: ${doc.documentType}`);
          return;
        }

        studentDocuments[studentId].documents.push({
          _id: doc.documentId._id,
          documentType: doc.documentType,
          fileName: doc.documentId.fileName,
          originalName: doc.documentId.originalName || doc.documentId.fileName,
          mimeType: doc.documentId.mimeType,
          fileSize: doc.documentId.fileSize,
          uploadedAt: doc.uploadedAt,
          status: doc.status,
          remarks: doc.documentId.remarks
        });
      });
    });

    // Convert to array and filter out students with no documents
    const allDocuments = Object.values(studentDocuments).filter(student => student.documents.length > 0);

    res.json({
      success: true,
      data: allDocuments
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get notices (placeholder - implement as needed)
router.get('/notices', async (req, res) => {
  try {
    // Placeholder implementation - return empty array for now
    res.json([]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get dashboard totals
router.get('/dashboard/totals', async (req, res) => {
  try {
    const department = req.user.department;

    // Get counts for dashboard
    const eventsCount = await Event.countDocuments({ department });
    const studentsCount = await Student.countDocuments({ department });
    const attendanceRecords = await Attendance.countDocuments({ department });
    const studyMaterialsCount = await StudyMaterial.countDocuments({ course: department });

    res.json({
      events: eventsCount,
      students: studentsCount,
      attendance: attendanceRecords,
      studyMaterials: studyMaterialsCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get attendance trends for dashboard (last 30 days)
router.get('/dashboard/attendance-trends', async (req, res) => {
  try {
    const department = req.user.department;

    // Get date range for last 30 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    // Aggregate attendance data by date
    const attendanceTrends = await Attendance.aggregate([
      {
        $match: {
          department: department,
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" }
          },
          totalRecords: { $sum: 1 },
          presentCount: {
            $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          date: "$_id",
          percentage: {
            $multiply: [
              { $divide: ["$presentCount", "$totalRecords"] },
              100
            ]
          },
          totalRecords: 1,
          presentCount: 1
        }
      },
      {
        $sort: { date: 1 }
      }
    ]);

    // Format the response
    const trends = attendanceTrends.map(item => ({
      date: item.date,
      percentage: Math.round(item.percentage * 100) / 100, // Round to 2 decimal places
      totalRecords: item.totalRecords,
      presentCount: item.presentCount
    }));

    res.json(trends);
  } catch (error) {
    console.error('Error fetching attendance trends:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get performance data for dashboard (subject-wise average attendance as proxy)
router.get('/dashboard/performance', async (req, res) => {
  try {
    const department = req.user.department;

    // Aggregate attendance by subject for performance metrics
    const performanceData = await Attendance.aggregate([
      {
        $match: {
          department: department,
          date: { $gte: new Date(Date.now() - 30*24*60*60*1000) } // Last 30 days
        }
      },
      {
        $group: {
          _id: '$subject',
          totalRecords: { $sum: 1 },
          presentCount: {
            $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          subject: '$_id',
          avgMarks: { // Proxy: attendance % as 'performance'
            $multiply: [
              { $divide: ['$presentCount', '$totalRecords'] },
              100
            ]
          }
        }
      },
      {
        $sort: { avgMarks: -1 }
      },
      {
        $limit: 5
      }
    ]);

    // If no data, return sample
    if (performanceData.length === 0) {
      performanceData.push(
        { subject: 'Mathematics', avgMarks: 85 },
        { subject: 'Physics', avgMarks: 78 },
        { subject: 'Chemistry', avgMarks: 82 }
      );
    }

    res.json(performanceData);
  } catch (error) {
    console.error('Error fetching performance data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get recent notices (use Events as proxy for notices)
router.get('/notices', async (req, res) => {
  try {
    const { limit = 5, sort = '-createdAt' } = req.query;
    const notices = await Event.find({ department: req.user.department })
      .sort(sort)
      .limit(parseInt(limit))
      .select('title description createdAt priority: { $ifNull: ["normal", "normal"] }'); // Map status to priority if needed

    // Add priority if not present
    const formattedNotices = notices.map(notice => ({
      ...notice.toObject(),
      priority: notice.status === 'approved' ? 'normal' : 'high',
      content: notice.description
    }));

    res.json(formattedNotices);
  } catch (error) {
    console.error('Error fetching notices:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get faculty list (for faculty management)
router.get('/faculty', async (req, res) => {
  try {
    const faculty = await Faculty.find({}).select('-password');
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get students list for faculty dashboard
router.get('/students-list', async (req, res) => {
  try {
    const students = await Student.find({ department: req.user.department })
      .select('username studentId email department profilePicture status')
      .sort({ username: 1 });

    res.json({
      success: true,
      data: students
    });
  } catch (error) {
    console.error('Error fetching students list:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get basic student profiles for faculty dashboard (similar to student dashboard Profile & Admission)
router.get('/student-profiles/basic', async (req, res) => {
  try {
    const students = await Student.find({ department: req.user.department })
      .select('name username email department profilePicture createdAt')
      .sort({ name: 1 });

    // Format data similar to student dashboard Profile & Admission section
    const basicProfiles = students.map(student => ({
      _id: student._id,
      name: student.name || student.username,
      email: student.email,
      department: student.department,
      admissionDate: student.createdAt,
      profilePicture: student.profilePicture
    }));

    res.json({
      success: true,
      data: basicProfiles
    });
  } catch (error) {
    console.error('Error fetching basic student profiles:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get student profiles for faculty's department
router.get('/student-profiles', async (req, res) => {
  try {
    const { department, page = 1, limit = 10, studentId } = req.query;
    const skip = (page - 1) * limit;

    // If studentId is provided, return single profile
    if (studentId) {
      const student = await Student.findById(studentId)
        .populate('documents.documentId')
        .select('username email studentId department profilePicture documents');

      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      // Check if student belongs to faculty's department
      if (student.department !== req.user.department) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized - Student not in your department'
        });
      }

      return res.json({
        success: true,
        data: student
      });
    }

    // If department is specified, ensure it matches faculty's department
    const queryDepartment = department || req.user.department;

    // Only allow faculty to access their own department's profiles
    if (department && department !== req.user.department) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized - Can only access profiles from your department'
      });
    }

    const total = await Student.countDocuments({
      department: queryDepartment
    });

    const students = await Student.find({
      department: queryDepartment
    })
    .populate('documents.documentId')
    .select('username email studentId department profilePicture documents')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

    res.json({
      success: true,
      data: students,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching student profiles:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get pending student profiles for faculty's department
router.get('/student-profiles/pending', async (req, res) => {
  try {
    // Get students from faculty's department
    const students = await Student.find({ department: req.user.department }).select('_id');
    const studentIds = students.map(s => s._id);

    const profiles = await DetailedStudentProfile.find({
      student: { $in: studentIds },
      'documents.status': 'pending'
    })
    .populate('student', 'username email studentId department profilePicture')
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: profiles
    });
  } catch (error) {
    console.error('Error fetching pending student profiles:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update student profile
router.put('/student-profiles/:id', async (req, res) => {
  try {
    const profileId = req.params.id;
    const updateData = req.body;

    const profile = await DetailedStudentProfile.findById(profileId);
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    // Check if profile belongs to faculty's department
    const student = await Student.findById(profile.student);
    if (!student || student.department !== req.user.department) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized - Profile not in your department'
      });
    }

    const updatedProfile = await DetailedStudentProfile.findByIdAndUpdate(
      profileId,
      updateData,
      { new: true, runValidators: true }
    ).populate('student', 'username email studentId department profilePicture');

    res.json({
      success: true,
      message: 'Student profile updated successfully',
      data: updatedProfile
    });
  } catch (error) {
    console.error('Error updating student profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Save detailed student profile
router.post('/student-profiles', async (req, res) => {
  try {
    const profileData = req.body;

    // Validate required fields
    if (!profileData.student) {
      return res.status(400).json({
        success: false,
        message: 'Student ID is required'
      });
    }

    // Check if student exists and belongs to faculty's department
    const student = await Student.findById(profileData.student);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    if (student.department !== req.user.department) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized - Student not in your department'
      });
    }

    // Check if profile already exists
    const existingProfile = await DetailedStudentProfile.findOne({ student: profileData.student });

    let profile;
    if (existingProfile) {
      // Update existing profile
      profile = await DetailedStudentProfile.findByIdAndUpdate(
        existingProfile._id,
        profileData,
        { new: true, runValidators: true }
      );
    } else {
      // Create new profile
      profile = new DetailedStudentProfile(profileData);
      await profile.save();
    }

    const populatedProfile = await DetailedStudentProfile.findById(profile._id)
      .populate('student', 'username email studentId department profilePicture');

    res.status(existingProfile ? 200 : 201).json({
      success: true,
      message: existingProfile ? 'Student profile updated successfully' : 'Student profile created successfully',
      data: populatedProfile
    });
  } catch (error) {
    console.error('Error saving student profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload student document
router.post('/student-profiles/:studentId/documents', uploadDocument, async (req, res) => {
  try {
    const { studentId } = req.params;
    const { documentType, remarks } = req.body;

    // Check if student exists and belongs to faculty's department
    const student = await Student.findById(studentId);
    if (!student || student.department !== req.user.department) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized - Student not in your department'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Create document record
    const document = new Document({
      student: studentId,
      documentType,
      fileName: req.file.originalname,
      filePath: 'memory',
      fileData: req.file.buffer,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      status: 'pending',
      remarks: remarks || '',
      uploadedBy: req.user._id
    });

    await document.save();

    // Update student profile with document reference
    const documentRef = {
      documentType,
      documentId: document._id,
      status: 'pending',
      uploadedAt: new Date()
    };

    await DetailedStudentProfile.findOneAndUpdate(
      { student: studentId },
      { $push: { documents: documentRef } },
      { upsert: true }
    );

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      data: document
    });
  } catch (error) {
    console.error('Error uploading student document:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get courses for faculty's department
router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find({ department: req.user.department }).sort({ name: 1 });
    res.json({
      success: true,
      data: courses
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get notifications for faculty
router.get('/notifications', async (req, res) => {
  try {
    const notifications = await Notification.find({
      $or: [
        { targetAudience: 'all' },
        { targetAudience: req.user.department },
        { targetAudience: 'faculty' }
      ]
    }).sort({ createdAt: -1 }).limit(20);

    res.json({
      success: true,
      data: notifications
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get tasks for faculty
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({
      $or: [
        { assignedTo: req.user._id },
        { department: req.user.department }
      ]
    })
    .populate('assignedTo', 'username email')
    .sort({ dueDate: 1 });

    res.json({
      success: true,
      data: tasks
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get communication templates
router.get('/communication-templates', async (req, res) => {
  try {
    const templates = await CommunicationTemplate.find({
      $or: [
        { type: 'faculty' },
        { type: 'all' }
      ]
    }).sort({ name: 1 });

    res.json({
      success: true,
      data: templates
    });
  } catch (error) {
    console.error('Error fetching communication templates:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Document verification endpoints

// Get pending documents for verification (department-wise)
router.get('/documents/pending', async (req, res) => {
  try {
    // Get students from faculty's department with their documents
    const students = await Student.find({ department: req.user.department })
      .populate('documents.documentId')
      .select('username studentId documents');

    // Filter documents with pending status
    const pendingDocuments = [];
    students.forEach(student => {
      student.documents.forEach(doc => {
        if (doc.status === 'pending') {
          pendingDocuments.push({
            _id: doc.documentId._id,
            studentId: student._id,
            studentName: student.username,
            documentType: doc.documentType,
            fileName: doc.documentId.fileName,
            originalName: doc.documentId.originalName,
            mimeType: doc.documentId.mimeType,
            fileSize: doc.documentId.fileSize,
            uploadedAt: doc.uploadedAt,
            remarks: doc.documentId.remarks
          });
        }
      });
    });

    res.json({
      success: true,
      data: pendingDocuments
    });
  } catch (error) {
    console.error('Error fetching pending documents:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/documents/:id', async (req, res) => {
  try {
    const Document = (await import('../models/Document.js')).default;

    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check if document belongs to faculty's department
    const student = await Student.findById(document.student);
    if (!student || student.department !== req.user.department) {
      return res.status(403).json({ message: 'Unauthorized - Document not in your department' });
    }

    // Set appropriate headers for download
    res.setHeader('Content-Type', document.mimeType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${document.fileName}"`);
    res.setHeader('Cache-Control', 'public, max-age=31536000');

    // Send the file buffer
    res.send(document.fileData);
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

 // Approve/reject a document
router.patch('/documents/:id/approve', async (req, res) => {
  try {
    const Document = (await import('../models/Document.js')).default;
    const DetailedStudentProfile = (await import('../models/DetailedStudentProfile.js')).default;

    const { status, remarks } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be approved or rejected' });
    }

    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check if document belongs to faculty's department
    const student = await Student.findById(document.student);
    if (!student || student.department !== req.user.department) {
      return res.status(403).json({ message: 'Unauthorized - Document not in your department' });
    }

    // Update document
    document.status = status === 'approved' ? 'verified' : status;
    document.verifiedBy = req.user._id;
    document.verifiedAt = new Date();
    if (remarks) document.remarks = remarks;

    await document.save();

    // Update status in detailed profile
    const detailedProfile = await DetailedStudentProfile.findOne({ student: document.student });
    if (detailedProfile) {
      const docIndex = detailedProfile.documents.findIndex(doc => doc.documentId.toString() === req.params.id);
      if (docIndex !== -1) {
        detailedProfile.documents[docIndex].status = status === 'approved' ? 'verified' : status;
        await detailedProfile.save();
      }
    }

    res.json({
      success: true,
      message: `Document ${status} successfully`,
      data: document
    });
  } catch (error) {
    console.error('Error approving document:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get verification history
router.get('/documents/verification-history', async (req, res) => {
  try {
    // Get students from faculty's department with their documents
    const students = await Student.find({ department: req.user.department })
      .populate('documents.documentId')
      .select('username studentId documents');

    // Filter documents with verified or rejected status
    const verificationHistory = [];
    students.forEach(student => {
      student.documents.forEach(doc => {
        if (doc.status === 'verified' || doc.status === 'rejected') {
          verificationHistory.push({
            _id: doc.documentId._id,
            student: {
              _id: student._id,
              username: student.username,
              studentId: student.studentId
            },
            documentType: doc.documentType,
            fileName: doc.documentId.fileName,
            status: doc.status,
            verifiedBy: doc.documentId.verifiedBy,
            verifiedAt: doc.documentId.verifiedAt,
            remarks: doc.documentId.remarks
          });
        }
      });
    });

    // Sort by verifiedAt date descending
    verificationHistory.sort((a, b) => new Date(b.verifiedAt) - new Date(a.verifiedAt));

    res.json({
      success: true,
      data: verificationHistory
    });
  } catch (error) {
    console.error('Error fetching verification history:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
