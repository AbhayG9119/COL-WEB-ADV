

import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { existsSync } from 'fs';
import Student from '../models/Student.js';
import StudentBA from '../models/StudentBA.js';
import StudentBSc from '../models/StudentBSc.js';
import StudentBEd from '../models/StudentBEd.js';
import Course from '../models/Course.js';
import Form from '../models/formModel.js';
import Attendance from '../models/Attendance.js';
import Event from '../models/Event.js';
import Document from '../models/Document.js';
import StudyMaterial from '../models/StudyMaterial.js';
import authMiddleware from '../middleware/authMiddleware.js';
import DetailedStudentProfile from '../models/DetailedStudentProfile.js';
import uploadDocument, { handleUploadError } from '../middleware/fileUpload.js';

const router = express.Router();

// Helper function to get the correct student model based on department
const getStudentModel = (department) => {
  if (department === 'B.A') return StudentBA;
  if (department === 'B.Sc') return StudentBSc;
  if (department === 'B.Ed') return StudentBEd;
  return Student; // fallback to old model
};

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
      studentId: req.user._id,
      department: req.user.department,
    });

    await form.save();
    res.status(201).json(form);
  } catch (error) {
    console.error('Error creating form:', error);
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
    console.error('Error updating form:', error);
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
    console.error('Error deleting form:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete student account (only for the student themselves)
router.delete('/profile', authMiddleware, async (req, res) => {
  try {
    // Get the student model based on department
    const StudentModel = getStudentModel(req.user.department);

    const student = await StudentModel.findById(req.user._id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if student has any pending forms or active enrollments
    const pendingForms = await Form.countDocuments({
      submittedBy: req.user._id,
      status: 'pending'
    });

    if (pendingForms > 0) {
      return res.status(409).json({
        message: `Cannot delete account. You have ${pendingForms} pending form(s). Please resolve them first.`
      });
    }

    // Delete associated records
    await Promise.all([
      Form.deleteMany({ submittedBy: req.user._id }),
      Attendance.deleteMany({ studentId: req.user._id }),
      Document.deleteMany({ studentId: req.user._id }),
      DetailedStudentProfile.deleteOne({ student: req.user._id })
    ]);

    // Delete the student account
    await StudentModel.findByIdAndDelete(req.user._id);

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting student account:', error);
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

      // Get the student model based on department
      const StudentModel = getStudentModel(req.user.department);
      await StudentModel.findByIdAndUpdate(req.user._id, { profilePicture: profilePictureUrl });

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
    // Get the student model based on department
    const StudentModel = getStudentModel(req.user.department);
    const student = await StudentModel.findById(req.user._id).select('-password');

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
    console.error('Error fetching profile:', error);
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
    console.error('Error fetching course content:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get detailed student profile
router.get('/detailed-profile', authMiddleware, async (req, res) => {
  try {
    let detailedProfile = await DetailedStudentProfile.findOne({ student: req.user._id });

    if (!detailedProfile) {
      // Get the basic student profile to populate detailed profile
      const StudentModel = getStudentModel(req.user.department);
      const student = await StudentModel.findById(req.user._id);

      // Create a default detailed profile if not found, populated with basic student data
      detailedProfile = new DetailedStudentProfile({
        student: req.user._id,
        fatherName: student.fatherName || '',
        motherName: '',
        dateOfBirth: student.dateOfBirth || null,
        religion: '',
        caste: '',
        domicile: '',
        aadharNumber: '',
        rollNumber: '',
        college: '',
        course: student.department || '',
        branch: '',
        admissionDate: null,
        admissionMode: '',
        admissionSession: '',
        academicSession: '',
        currentYear: student.year || '',
        currentSemester: student.semester || '',
        currentAcademicStatus: '',
        scholarshipApplied: '',
        hostelApplied: '',
        contactNumber: student.mobileNumber || '',
        fatherContactNumber: '',
        correspondenceAddress: student.correspondenceAddress || '',
        permanentAddress: '',
        email: student.email || req.user.email,
        qualifications: [],
        semesterResults: []
      });
      await detailedProfile.save();
    }

    res.json(detailedProfile);
  } catch (error) {
    console.error('Error fetching detailed profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update detailed student profile
router.put('/detailed-profile', authMiddleware, async (req, res) => {
  try {
    const updateData = req.body;

    // Validate Aadhar number format if provided
    if (updateData.aadharNumber && !/^\d{12}$/.test(updateData.aadharNumber)) {
      return res.status(400).json({
        message: 'Aadhar number must be exactly 12 digits'
      });
    }

    // Validate email format if provided
    if (updateData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updateData.email)) {
      return res.status(400).json({
        message: 'Invalid email format'
      });
    }

    let detailedProfile = await DetailedStudentProfile.findOne({ student: req.user._id });

    if (!detailedProfile) {
      detailedProfile = new DetailedStudentProfile({ student: req.user._id, ...updateData });
    } else {
      Object.assign(detailedProfile, updateData);
    }

    await detailedProfile.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: detailedProfile
    });
  } catch (error) {
    console.error('Error updating detailed profile:', error);

    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation error: ' + Object.values(error.errors).map(err => err.message).join(', ')
      });
    }

    res.status(500).json({ message: 'Server error' });
  }
});

// Update basic student profile
router.patch('/profile', authMiddleware, async (req, res) => {
  try {
    const { username, email, mobileNumber, fatherName, dateOfBirth, address } = req.body;

    // Validate mobile number if provided
    if (mobileNumber && !/^\d{10}$/.test(mobileNumber)) {
      return res.status(400).json({
        message: 'Mobile number must be exactly 10 digits'
      });
    }

    // Validate email format if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        message: 'Invalid email format'
      });
    }

    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (mobileNumber) updateData.mobileNumber = mobileNumber;
    if (fatherName !== undefined) updateData.fatherName = fatherName;
    if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;
    if (address !== undefined) updateData.correspondenceAddress = address;

    // Get the student model based on department
    const StudentModel = getStudentModel(req.user.department);
    const student = await StudentModel.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: student
    });
  } catch (error) {
    console.error('Error updating profile:', error);

    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation error: ' + Object.values(error.errors).map(err => err.message).join(', ')
      });
    }

    res.status(500).json({ message: 'Server error' });
  }
});

// Get student statistics
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const studentId = req.user._id;

    // Get counts
    const formsCount = await Form.countDocuments({ submittedBy: studentId });
    const documentsCount = await Document.countDocuments({ studentId });
    const attendanceRecords = await Attendance.find({ studentId });

    // Calculate attendance statistics
    const totalClasses = attendanceRecords.length;
    const presentCount = attendanceRecords.filter(record => record.status === 'present').length;
    const absentCount = attendanceRecords.filter(record => record.status === 'absent').length;
    const attendancePercentage = totalClasses > 0 ? (presentCount / totalClasses) * 100 : 0;

    // Get recent activities
    const recentForms = await Form.find({ submittedBy: studentId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title type status createdAt');

    const recentDocuments = await Document.find({ studentId })
      .sort({ uploadDate: -1 })
      .limit(5)
      .select('originalName documentType status uploadDate');

    res.json({
      success: true,
      data: {
        forms: {
          total: formsCount,
          recent: recentForms
        },
        documents: {
          total: documentsCount,
          recent: recentDocuments
        },
        attendance: {
          total: totalClasses,
          present: presentCount,
          absent: absentCount,
          percentage: Math.round(attendancePercentage * 100) / 100
        }
      }
    });
  } catch (error) {
    console.error('Error fetching student statistics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get events
router.get('/events', authMiddleware, async (req, res) => {
  try {
    const events = await Event.find({ status: 'approved' });
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get attendance
router.get('/attendance', authMiddleware, async (req, res) => {
  try {
    const attendance = await Attendance.find({ studentId: req.user._id });
    res.json(attendance);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get exam results
router.get('/exam-results', authMiddleware, async (req, res) => {
  try {
    const Result = (await import('../models/Result.js')).default;
    const results = await Result.find({ studentId: req.user._id })
      .populate('facultyId', 'username')
      .sort({ date: -1 });

    res.json(results);
  } catch (error) {
    console.error('Error fetching exam results:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get study materials
router.get('/study-materials', authMiddleware, async (req, res) => {
  try {
    console.log('Student department:', req.user.department);
    console.log('Student ID:', req.user._id);
    const materials = await StudyMaterial.find({ department: req.user.department })
      .populate('uploadedBy', 'username')
      .sort({ uploadedAt: -1 });
    console.log('Found materials:', materials.length);
    console.log('Materials:', materials.map(m => ({ title: m.title, department: m.department })));
    res.json(materials);
  } catch (error) {
    console.error('Error fetching study materials:', error);
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

// Get student documents
router.get('/documents', authMiddleware, async (req, res) => {
  try {
    const detailedProfile = await DetailedStudentProfile.findOne({ student: req.user._id })
      .populate('documents.documentId');

    if (!detailedProfile) {
      return res.json([]);
    }

    const documents = detailedProfile.documents.map(doc => ({
      _id: doc.documentId._id,
      fileName: doc.documentId.fileName,
      originalName: doc.documentId.originalName,
      mimeType: doc.documentId.mimeType,
      fileSize: doc.documentId.fileSize,
      documentType: doc.documentType,
      description: doc.documentId.description,
      uploadDate: doc.uploadedAt,
      status: doc.status,
      remarks: doc.documentId.remarks,
      verifiedBy: doc.documentId.verifiedBy,
      verificationDate: doc.documentId.verifiedAt
    }));

    res.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific document file
router.get('/documents/:id', authMiddleware, async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      student: req.user._id
    });

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Set appropriate headers
    res.setHeader('Content-Type', document.mimeType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `inline; filename="${document.fileName}"`);
    res.setHeader('Cache-Control', 'public, max-age=31536000');

    // Send the file buffer
    res.send(document.fileData);
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Download study material file
router.get('/study-materials/:id/download', authMiddleware, async (req, res) => {
  try {
    const material = await StudyMaterial.findOne({
      _id: req.params.id,
      department: req.user.department
    });

    if (!material) {
      return res.status(404).json({ message: 'Study material not found or access denied' });
    }

    const filePath = path.join(process.cwd(), 'uploads', 'study-materials', path.basename(material.fileUrl));

    if (!existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Set appropriate headers for download
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${material.fileName}"`);
    res.setHeader('Cache-Control', 'public, max-age=31536000');

    // Send the file
    res.sendFile(filePath);
  } catch (error) {
    console.error('Error downloading study material:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload document
router.post('/documents', authMiddleware, uploadDocument, handleUploadError, async (req, res) => {
  try {
    const { documentType, description } = req.body;

    // Validate required fields
    if (!documentType) {
      return res.status(400).json({
        success: false,
        message: 'Document type is required'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Validate file size (5MB limit)
    if (req.file.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: 'File size should not exceed 5MB'
      });
    }

    // Check if student profile exists
    let detailedProfile = await DetailedStudentProfile.findOne({ student: req.user._id });
    if (!detailedProfile) {
      // Create default profile if not exists
      detailedProfile = new DetailedStudentProfile({ student: req.user._id, branch: req.user.department });
      await detailedProfile.save();
    }

    // Check if document type already exists for this student
    const existingDocIndex = detailedProfile.documents.findIndex(doc => doc.documentType === documentType);
    if (existingDocIndex !== -1) {
      // Update existing document
      const existingDocId = detailedProfile.documents[existingDocIndex].documentId;
      await Document.findByIdAndUpdate(existingDocId, {
        fileName: req.file.originalname,
        fileData: req.file.buffer,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        status: 'pending',
        uploadedAt: new Date(),
        verifiedAt: null,
        verifiedBy: null,
        remarks: description || ''
      });
    } else {
      // Create new document
      const document = new Document({
        student: req.user._id,
        documentType,
        fileName: req.file.originalname,
        fileData: req.file.buffer,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        status: 'pending',
        remarks: description || '',
        uploadedBy: req.user._id
      });

      await document.save();

      // Add to student profile
      detailedProfile.documents.push({
        documentType,
        documentId: document._id,
        status: 'pending',
        uploadedAt: new Date()
      });
      await detailedProfile.save();
    }

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading document:', error);

    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error: ' + Object.values(error.errors).map(err => err.message).join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error while uploading document'
    });
  }
});

export default router;
