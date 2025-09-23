import express from 'express';
import auth from '../middleware/authMiddleware.js';
import roleAuth from '../middleware/roleAuth.js';
import Student from '../models/Student.js';
import Course from '../models/Course.js';
import DetailedStudentProfile from '../models/DetailedStudentProfile.js';
import Document from '../models/Document.js';
import Notification from '../models/Notification.js';
import Task from '../models/Task.js';
import CommunicationTemplate from '../models/CommunicationTemplate.js';

const router = express.Router();

// Middleware to authenticate and authorize academic cell access
router.use(auth, roleAuth(['academic-cell', 'academic_cell']));

// Dashboard Metrics
router.get('/dashboard/metrics', async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const newAdmissions = await Student.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30*24*60*60*1000) }
    });
    const completedProfiles = await DetailedStudentProfile.countDocuments();
    const pendingProfiles = totalStudents - completedProfiles;
    const pendingDocuments = await Document.countDocuments({ status: 'pending' });
    const upcomingDeadlines = await Task.countDocuments({
      dueDate: { $gte: new Date() },
      status: { $ne: 'completed' }
    });

    res.json({
      totalStudents,
      newAdmissions,
      completedProfiles,
      pendingProfiles,
      pendingDocuments,
      upcomingDeadlines,
      completionRate: totalStudents > 0 ? Math.round((completedProfiles / totalStudents) * 100) : 0
    });
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Student Management
router.get('/students', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const department = req.query.department || '';
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query.$or = [
        { username: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { studentId: new RegExp(search, 'i') }
      ];
    }
    if (department) {
      query.department = department;
    }

    const total = await Student.countDocuments(query);
    const students = await Student.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: students,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get student by ID
router.get('/students/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select('-password');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update student status
router.patch('/students/:id/status', async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { status, remarks },
      { new: true }
    ).select('-password');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({
      success: true,
      message: 'Student status updated successfully',
      data: student
    });
  } catch (error) {
    console.error('Error updating student status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Student Profile Management
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
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific student profile
router.get('/student-profiles/:id', async (req, res) => {
  try {
    const profile = await DetailedStudentProfile.findById(req.params.id)
      .populate('student', 'username email studentId department');

    if (!profile) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    res.json(profile);
  } catch (error) {
    console.error('Error fetching student profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update student profile
router.put('/student-profiles/:id', async (req, res) => {
  try {
    const profileId = req.params.id;
    const profileData = req.body;

    const updatedProfile = await DetailedStudentProfile.findByIdAndUpdate(
      profileId,
      profileData,
      { new: true, runValidators: true }
    ).populate('student', 'username email studentId department');

    if (!updatedProfile) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

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

// Course Management
router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find().sort({ name: 1 });
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new course
router.post('/courses', async (req, res) => {
  try {
    const { name, code, department, credits, semester } = req.body;
    const course = new Course({ name, code, department, credits, semester });
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update course
router.put('/courses/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(400).json({ message: error.message });
  }
});

// Document Management
router.get('/documents', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || '';
    const skip = (page - 1) * limit;

    let query = {};
    if (status) {
      query.status = status;
    }

    const total = await Document.countDocuments(query);
    const documents = await Document.find(query)
      .populate('studentId', 'username email studentId')
      .sort({ uploadedAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: documents,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify document
router.patch('/documents/:id/verify', async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const document = await Document.findByIdAndUpdate(
      req.params.id,
      { status, remarks, verifiedBy: req.user._id, verifiedAt: new Date() },
      { new: true }
    ).populate('studentId', 'username email studentId');

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json({
      success: true,
      message: 'Document verification updated successfully',
      data: document
    });
  } catch (error) {
    console.error('Error verifying document:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Task Management
router.get('/tasks', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || '';
    const skip = (page - 1) * limit;

    let query = {};
    if (status) {
      query.status = status;
    }

    const total = await Task.countDocuments(query);
    const tasks = await Task.find(query)
      .populate('assignedTo', 'username email')
      .sort({ dueDate: 1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: tasks,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new task
router.post('/tasks', async (req, res) => {
  try {
    const { title, description, assignedTo, dueDate, priority } = req.body;
    const task = new Task({
      title,
      description,
      assignedTo,
      dueDate,
      priority,
      createdBy: req.user._id
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update task status
router.patch('/tasks/:id/status', async (req, res) => {
  try {
    const { status, progress } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status, progress, updatedBy: req.user._id },
      { new: true }
    ).populate('assignedTo', 'username email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: task
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Communication Templates
router.get('/communication-templates', async (req, res) => {
  try {
    const templates = await CommunicationTemplate.find().sort({ name: 1 });
    res.json(templates);
  } catch (error) {
    console.error('Error fetching communication templates:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create communication template
router.post('/communication-templates', async (req, res) => {
  try {
    const { name, subject, content, type } = req.body;
    const template = new CommunicationTemplate({
      name,
      subject,
      content,
      type,
      createdBy: req.user._id
    });
    await template.save();
    res.status(201).json(template);
  } catch (error) {
    console.error('Error creating communication template:', error);
    res.status(400).json({ message: error.message });
  }
});

// Notifications
router.get('/notifications', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Notification.countDocuments();
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: notifications,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create notification
router.post('/notifications', async (req, res) => {
  try {
    const { title, message, type, targetAudience } = req.body;
    const notification = new Notification({
      title,
      message,
      type,
      targetAudience,
      createdBy: req.user._id
    });
    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(400).json({ message: error.message });
  }
});

// Academic Cell Profile Management
router.get('/profile', async (req, res) => {
  try {
    const profile = await req.user; // User is already populated by auth middleware
    res.json({
      id: profile._id,
      username: profile.username,
      email: profile.email,
      department: profile.department,
      employeeId: profile.employeeId,
      phone: profile.phone,
      role: profile.role
    });
  } catch (error) {
    console.error('Error fetching academic cell profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update academic cell profile
router.patch('/profile', async (req, res) => {
  try {
    const { department, phone } = req.body;
    const updatedProfile = await req.user.constructor.findByIdAndUpdate(
      req.user._id,
      { department, phone },
      { new: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedProfile
    });
  } catch (error) {
    console.error('Error updating academic cell profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
