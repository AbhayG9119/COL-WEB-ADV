import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import Faculty from '../models/Faculty.js';
import Student from '../models/studentModel.js';
import StudentBAS from '../models/StudentBAS.js';
import StudentBSc from '../models/StudentBSc.js';
import StudentBEd from '../models/StudentBEd.js';

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export const login = async (req, res) => {
  const { email, password, role: requestedRole } = req.body;

  if (!email || !password || !requestedRole) {
    return res.status(400).json({ message: 'Email, password, and role are required' });
  }

  try {
    let user;
    let role;

    if (requestedRole === 'admin') {
      user = await Admin.findOne({ email });
      role = 'admin';
    } else if (requestedRole === 'faculty') {
      user = await Faculty.findOne({ email });
      role = 'faculty';
    } else if (requestedRole === 'student') {
      // Query all department collections for students
      user = await StudentBAS.findOne({ email }) ||
             await StudentBSc.findOne({ email }) ||
             await StudentBEd.findOne({ email });
      role = 'student';
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id, role);

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role,
        name: user.username || user.name || user.email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const signup = async (req, res) => {
  const { username, email, department, year, semester, mobileNumber, password } = req.body;

  if (!username || !email || !department || !year || !semester || !mobileNumber || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    let StudentModel;
    if (department === 'B.A') {
      StudentModel = StudentBAS;
    } else if (department === 'B.Sc') {
      StudentModel = StudentBSc;
    } else if (department === 'B.Ed') {
      StudentModel = StudentBEd;
    } else {
      return res.status(400).json({ message: 'Invalid department' });
    }

    // Check if user already exists
    const existingUser = await StudentModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new StudentModel({
      name: username,
      email,
      department,
      year,
      semester,
      mobileNumber,
      password
    });

    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
