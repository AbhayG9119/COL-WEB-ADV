import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { existsSync } from 'fs';
import Student from '../models/Student.js';
import Course from '../models/Course.js';
import Form from '../models/formModel.js';
import Attendance from '../models/Attendance.js';
import Event from '../models/Event.js';
import Document from '../models/Document.js';
import authMiddleware from '../middleware/authMiddleware.js';
import DetailedStudentProfile from '../models/DetailedStudentProfile.js';

const router = express.Router();

// Configure multer for profile picture uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profile-pictures/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, req.user._id + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Assuming other form routes are defined here (create, update, delete forms)...

// Create a form
router.post('/forms', authMiddleware, async (req, res) => {
  try {
    const { title, description, type, priority, attachments } = req.body;

    const form = new Form({
      title,
      description,
      type,
      priority,
      attachments: attachments || [],
      submittedBy: req.user._id,
      studentId: req.user.studentId,
      department: req.user.department,
    });

    await form.save();
    res.status(201).json(form);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a form (only if status is pending)
router.put('/forms/:id', authMiddleware, async (req, res) => {
  try {
    const { title, description, type, priority } = req.body;

    const form = await Form.findOne({
      _id: req.params.id,
      submittedBy: req.user._id,
      status: 'pending',
    });

    if (!form) {
      return res.status(404).json({ message: 'Form not found or cannot be updated' });
    }

    form.title = title || form.title;
    form.description = description || form.description;
    form.type = type || form.type;
    form.priority = priority || form.priority;

    await form.save();
    res.json(form);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a form (only if status is pending)
router.delete('/forms/:id', authMiddleware, async (req, res) => {
  try {
    const form = await Form.findOneAndDelete({
      _id: req.params.id,
      submittedBy: req.user._id,
      status: 'pending',
    });

    if (!form) {
      return res.status(404).json({ message: 'Form not found or cannot be deleted' });
    }

    res.json({ message: 'Form deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload profile picture
router.post('/upload-profile-picture', authMiddleware, (req, res) => {
  upload.single('profilePicture')(req, res, async (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
        }
      }
      return res.status(400).json({ message: err.message || 'File upload error' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
      const profilePictureUrl = `/uploads/profile-pictures/${req.file.filename}`;

      await Student.findByIdAndUpdate(req.user._id, { profilePicture: profilePictureUrl });

      res.json({ message: 'Profile picture uploaded successfully', profilePicture: profilePictureUrl });
    } catch (error) {
      console.error('Error updating profile picture:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
});

// Get student profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const student = await Student.findById(req.user._id).select('-password');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const formsCount = await Form.countDocuments({ submittedBy: req.user._id });

    const attendanceRecords = await Attendance.find({ studentId: req.user._id });

    const profile = {
      ...student.toObject(),
      formsCount,
      attendance: {
        totalClasses: attendanceRecords.length,
        present: attendanceRecords.filter(record => record.status === 'present').length,
        percentage: attendanceRecords.length > 0 ? (attendanceRecords.filter(record => record.status === 'present').length / attendanceRecords.length) * 100 : 0,
        records: attendanceRecords
      }
    };

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get course content for the student's department
router.get('/course-content', authMiddleware, async (req, res) => {
  try {
    const course = await Course.findOne({ department: req.user.department });

    if (!course) {
      return res.status(404).json({ message: 'Course not found for your department' });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get detailed student profile
router.get('/detailed-profile', authMiddleware, async (req, res) => {
  try {
    let detailedProfile = await DetailedStudentProfile.findOne({ student: req.user._id });

    if (!detailedProfile) {
      // Create a default detailed profile if not found
      detailedProfile = new DetailedStudentProfile({
        student: req.user._id,
        fatherName: '',
        motherName: '',
        dateOfBirth: null,
        religion: '',
        caste: '',
        domicile: '',
        aadharNumber: '',
        rollNumber: '',
        college: '',
        course: '',
        branch: '',
        admissionDate: null,
        admissionMode: '',
        admissionSession: '',
        academicSession: '',
        currentYear: '',
        currentSemester: '',
        currentAcademicStatus: '',
        scholarshipApplied: '',
        hostelApplied: '',
        contactNumber: '',
        fatherContactNumber: '',
        correspondenceAddress: '',
        permanentAddress: '',
        email: req.user.email,
        qualifications: [],
        semesterResults: []
      });
      await detailedProfile.save();
    }

    res.json(detailedProfile);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update detailed student profile
router.put('/detailed-profile', authMiddleware, async (req, res) => {
  try {
    const updateData = req.body;

    let detailedProfile = await DetailedStudentProfile.findOne({ student: req.user._id });

    if (!detailedProfile) {
      detailedProfile = new DetailedStudentProfile({ student: req.user._id, ...updateData });
    } else {
      Object.assign(detailedProfile, updateData);
    }

    await detailedProfile.save();

    res.json(detailedProfile);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get events
router.get('/events', authMiddleware, async (req, res) => {
  try {
    const events = await Event.find({ status: 'approved' });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get attendance
router.get('/attendance', authMiddleware, async (req, res) => {
  try {
    const attendance = await Attendance.find({ studentId: req.user._id });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get exam results (mock data for now)
router.get('/exam-results', authMiddleware, async (req, res) => {
  try {
    // Mock exam results
    const examResults = [
      { subject: 'Mathematics', date: '2023-12-01', grade: 'A' },
      { subject: 'Physics', date: '2023-12-05', grade: 'B+' },
      { subject: 'Chemistry', date: '2023-12-10', grade: 'A-' }
    ];
    res.json(examResults);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get study materials
router.get('/study-materials', authMiddleware, async (req, res) => {
  try {
    // Mock study materials
    const studyMaterials = [
      { title: 'Mathematics Notes', description: 'Comprehensive notes for semester 1', downloadUrl: '/downloads/math-notes.pdf' },
      { title: 'Physics Lab Manual', description: 'Lab experiments guide', downloadUrl: '/downloads/physics-lab.pdf' },
      { title: 'Chemistry Reference', description: 'Quick reference for organic chemistry', downloadUrl: '/downloads/chem-ref.pdf' }
    ];
    res.json(studyMaterials);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get profile picture by filename
router.get('/profile-picture/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(process.cwd(), 'uploads', 'profile-pictures', filename);

  // Check if file exists
  if (!existsSync(filePath)) {
    return res.status(404).json({ message: 'File not found' });
  }

  // Send the file
  res.sendFile(filePath);
});

// Proxy endpoint for profile pictures (alternative approach)
router.get('/image-proxy/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(process.cwd(), 'uploads', 'profile-pictures', filename);

  if (!existsSync(filePath)) {
    return res.status(404).json({ message: 'File not found' });
  }

  // Read file and send as buffer
  const fileBuffer = fs.readFileSync(filePath);
  const mimeType = filename.endsWith('.jpg') || filename.endsWith('.jpeg') ? 'image/jpeg' :
                   filename.endsWith('.png') ? 'image/png' :
                   filename.endsWith('.webp') ? 'image/webp' : 'image/jpeg';

  res.setHeader('Content-Type', mimeType);
  res.setHeader('Cache-Control', 'public, max-age=31536000');
  res.send(fileBuffer);
});

export default router;
