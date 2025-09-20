import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import Student from '../models/Student.js';
import Course from '../models/Course.js';
import DetailedStudentProfile from '../models/DetailedStudentProfile.js';

const router = express.Router();

// Middleware to verify token
router.use(authMiddleware);

// Add authorization middleware for academic cell routes
router.use((req, res, next) => {
  // Assuming user role is stored in req.user.role
  if (req.user && req.user.role === 'academic-cell') {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Access is denied' });
  }
});

// Metrics
router.get('/metrics', async (req, res) => {
  try {
    const totalEnrolled = await Student.countDocuments();
    const newAdmissions = await Student.countDocuments({ createdAt: { $gte: new Date(Date.now() - 30*24*60*60*1000) } }); // Last 30 days
    const completedProfiles = await DetailedStudentProfile.countDocuments();
    const pendingProfiles = totalEnrolled - completedProfiles;
    const incompleteDocuments = 0; // Placeholder
    const upcomingDeadlines = 0; // Placeholder

    res.json({
      totalEnrolled,
      newAdmissions,
      completedProfiles,
      pendingProfiles,
      incompleteDocuments,
      upcomingDeadlines,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all student profiles with detailed information
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

// Get specific student profile by ID
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

// Get student profile by student ID
router.get('/student-profile/:studentId', async (req, res) => {
  try {
    const profile = await DetailedStudentProfile.findOne({ student: req.params.studentId })
      .populate('student', 'username email studentId department');

    if (!profile) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    res.json(profile);
  } catch (error) {
    console.error('Error fetching student profile by student ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update existing student profile
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

// Admissions management
router.get('/admissions', async (req, res) => {
  try {
    const admissions = await Student.find().select('username email studentId department createdAt');
    res.json(admissions.map(student => ({
      id: student._id,
      studentName: student.username,
      email: student.email,
      status: 'approved', // Placeholder
    })));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Pending profiles
router.get('/pending-profiles', async (req, res) => {
  try {
    const profiles = await Student.find().select('username email department');
    res.json(profiles.map(student => ({
      id: student._id,
      name: student.username,
      department: student.department,
      status: 'verified', // Placeholder
    })));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Document verification
router.get('/documents', async (req, res) => {
  try {
    // Placeholder for documents
    res.json([]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Course & semester management
router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Notifications
router.get('/notifications', async (req, res) => {
  try {
    // Placeholder for notifications
    res.json([]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Tasks
router.get('/tasks', async (req, res) => {
  try {
    // Placeholder for tasks
    res.json([]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Communication templates
router.get('/communication-templates', async (req, res) => {
  try {
    // Placeholder for templates
    res.json([]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to create or update detailed student profile
router.post('/detailed-profile', async (req, res) => {
  try {
    const studentId = req.user.id; // Assuming user id is in req.user.id
    const profileData = req.body;

    let detailedProfile = await DetailedStudentProfile.findOne({ student: studentId });
    if (detailedProfile) {
      // Update existing profile
      Object.assign(detailedProfile, profileData);
      await detailedProfile.save();
    } else {
      // Create new profile
      detailedProfile = new DetailedStudentProfile({
        student: studentId,
        ...profileData,
      });
      await detailedProfile.save();
    }
    res.json(detailedProfile);
  } catch (error) {
    console.error('Error saving detailed profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to get detailed student profile for logged in student
router.get('/detailed-profile', async (req, res) => {
  try {
    const studentId = req.user.id;
    const detailedProfile = await DetailedStudentProfile.findOne({ student: studentId });
    if (!detailedProfile) {
      return res.status(404).json({ message: 'Detailed profile not found' });
    }
    res.json(detailedProfile);
  } catch (error) {
    console.error('Error fetching detailed profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
