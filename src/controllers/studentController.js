import jwt from 'jsonwebtoken';
import StudentBAS from '../models/StudentBAS.js';
import StudentBSc from '../models/StudentBSc.js';
import StudentBEd from '../models/StudentBEd.js';

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
    res.json({
      name: student.name,
      email: student.email,
      department: student.department,
      year: student.year,
      semester: student.semester,
      mobileNumber: student.mobileNumber
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

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
    if (name !== undefined) student.name = name;
    if (mobileNumber !== undefined) student.mobileNumber = mobileNumber;

    await student.save();

    res.json({
      message: 'Profile updated successfully',
      student: {
        name: student.name,
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
