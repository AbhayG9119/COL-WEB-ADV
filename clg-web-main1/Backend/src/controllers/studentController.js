import jwt from 'jsonwebtoken';
import StudentBAS from '../models/StudentBAS.js';
import StudentBSc from '../models/StudentBSc.js';
import StudentBEd from '../models/StudentBEd.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Helper function to get student model based on department
const getStudentModel = (department) => {
  switch (department) {
    case 'B.A':
      return StudentBAS;
    case 'B.Sc':
      return StudentBSc;
    case 'B.Ed':
      return StudentBEd;
    default:
      return null;
  }
};

// Helper function to find student by ID across all collections
const findStudentById = async (id) => {
  let student = await StudentBAS.findById(id);
  if (student) return { student, model: StudentBAS };

  student = await StudentBSc.findById(id);
  if (student) return { student, model: StudentBSc };

  student = await StudentBEd.findById(id);
  if (student) return { student, model: StudentBEd };

  return null;
};

// Get student profile
export const getProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const studentData = await findStudentById(decoded.id);

    if (!studentData) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const { student } = studentData;
    // Construct full name from firstName, middleName, lastName
    const name = [student.firstName, student.middleName, student.lastName].filter(Boolean).join(' ');
    res.json({
      name: name,
      email: student.email,
      department: student.department,
      year: student.year,
      semester: student.semester,
      mobileNumber: student.mobileNumber,
      profilePhoto: student.profilePhoto
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads', 'profile-pictures');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'student-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Upload profile picture
export const uploadProfilePicture = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const studentData = await findStudentById(decoded.id);

    if (!studentData) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const { student, model } = studentData;

    // Delete old profile picture if exists
    if (student.profilePhoto) {
      const oldPhotoPath = path.join(process.cwd(), 'uploads', 'profile-pictures', path.basename(student.profilePhoto));
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath);
      }
    }

    // Update profile photo path
    student.profilePhoto = req.file.filename;
    await student.save();

    res.json({
      message: 'Profile picture uploaded successfully',
      profilePhoto: req.file.filename
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Export multer middleware
export const uploadMiddleware = upload.single('profilePicture');

// Update student profile
export const updateProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const studentData = await findStudentById(decoded.id);

    if (!studentData) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const { student, model } = studentData;
    const { name, mobileNumber } = req.body;

    // Update allowed fields (only name and mobileNumber)
    if (name !== undefined) {
      // Parse full name into firstName, middleName, lastName
      const nameParts = name.trim().split(' ');
      student.firstName = nameParts[0] || '';
      student.lastName = nameParts[nameParts.length - 1] || '';
      student.middleName = nameParts.length > 2 ? nameParts.slice(1, -1).join(' ') : '';
    }
    if (mobileNumber !== undefined) student.mobileNumber = mobileNumber;

    await student.save();

    // Construct full name for response
    const updatedName = [student.firstName, student.middleName, student.lastName].filter(Boolean).join(' ');

    res.json({
      message: 'Profile updated successfully',
      student: {
        name: updatedName,
        email: student.email,
        department: student.department,
        year: student.year,
        semester: student.semester,
        mobileNumber: student.mobileNumber
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
