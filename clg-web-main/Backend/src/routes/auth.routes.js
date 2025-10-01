import express from 'express';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import axios from 'axios';

import Student from '../models/Student.js';
import StudentBA from '../models/StudentBA.js';
import StudentBSc from '../models/StudentBSc.js';
import StudentBEd from '../models/StudentBEd.js';
import Faculty from '../models/Faculty.js';
import Admin from '../models/Admin.js';
import AcademicCell from '../models/AcademicCell.js';
import DetailedStudentProfile from '../models/DetailedStudentProfile.js';
import { generateOTP, storeOTP, verifyOTP, sendOTP } from '../utils/otp.js';

const router = express.Router();

// Faculty Signup
router.post('/faculty/signup', async (req, res) => {
  try {
    const { username, email, password, department, subject } = req.body;
    const existingFaculty = await Faculty.findOne({ email });
    if (existingFaculty) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    const faculty = new Faculty({ username, email, password, department, subject });
    await faculty.save();
    res.status(201).json({ message: 'Faculty registered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Faculty Login
router.post('/faculty/login', async (req, res) => {
  try {
    const { email, password, captchaToken } = req.body;

    // Temporarily disable captcha verification for faculty login
    // const verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${captchaToken}`;
    // const response = await axios.post(verifyURL);
    // const { success } = response.data;

    // if (!success) return res.status(403).json({ message: 'Captcha verification failed' });

    const faculty = await Faculty.findOne({ email });
    if (!faculty || !(await faculty.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: faculty._id, role: faculty.role, department: faculty.department }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Student Signup
router.post('/student/signup', async (req, res) => {
  try {
    const { username, email, password, department, year, semester, mobileNumber, fatherName, dateOfBirth, address, admissionDate, captchaToken } = req.body;

    // Temporarily disable captcha verification for student signup
    // const verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${captchaToken}`;
    // const response = await axios.post(verifyURL);
    // const { success } = response.data;

    // if (!success) return res.status(403).json({ message: 'Captcha verification failed' });

    let StudentModel;
    if (department === 'B.A') {
      StudentModel = StudentBA;
    } else if (department === 'B.Sc') {
      StudentModel = StudentBSc;
    } else if (department === 'B.Ed') {
      StudentModel = StudentBEd;
    } else {
      return res.status(400).json({ message: 'Invalid department' });
    }

    const existingStudent = await StudentModel.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    const student = new StudentModel({ username, email, password, department, year, semester, mobileNumber, fatherName, dateOfBirth, correspondenceAddress: address, admissionDate });
    await student.save();

    // Create corresponding detailed student profile with initial data
    const DetailedStudentProfileModel = DetailedStudentProfile;
    const detailedProfile = new DetailedStudentProfileModel({
      student: student._id,
      fatherName: fatherName || '',
      dateOfBirth: dateOfBirth || null,
      correspondenceAddress: address || '',
      course: department,
      currentYear: year,
      currentSemester: semester,
      email: email,
      contactNumber: mobileNumber,
      username: username,
      admissionDate: admissionDate || null
    });
    await detailedProfile.save();

    res.status(201).json({ message: 'Student registered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Student Login
router.post('/student/login', async (req, res) => {
  try {
    const { email, password, captchaToken } = req.body;

    // Temporarily disable captcha verification for student login
    // const verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${captchaToken}`;
    // const response = await axios.post(verifyURL);
    // const { success } = response.data;

    // if (!success) return res.status(403).json({ message: 'Captcha verification failed' });

    // Check all student collections
    let student = await StudentBA.findOne({ email });
    if (!student) {
      student = await StudentBSc.findOne({ email });
    }
    if (!student) {
      student = await StudentBEd.findOne({ email });
    }

    if (!student || !(await student.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: student._id, role: student.role, department: student.department }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Student Forgot Password - Send OTP
router.post('/student/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    const otp = generateOTP();
    storeOTP(email, otp);

    // Send OTP via email
    console.log('SMTP Config:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD ? '***' : 'not set'
    });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: 'Your OTP for Password Reset',
      text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'OTP sent to your registered email address' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Student Verify OTP
router.post('/student/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (verifyOTP(email, otp)) {
      res.json({ message: 'OTP verified' });
    } else {
      res.status(400).json({ message: 'Invalid or expired OTP' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Student Reset Password
router.post('/student/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!verifyOTP(email, otp)) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    student.password = newPassword;
    await student.save();
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Academic Cell Login
router.post('/academic-cell/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const academicCell = await AcademicCell.findOne({ email });
    if (!academicCell || !(await academicCell.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign(
      {
        id: academicCell._id,
        role: academicCell.role || 'academic-cell',
        email: academicCell.email,
        username: academicCell.username
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({
      token,
      user: {
        id: academicCell._id,
        username: academicCell.username,
        email: academicCell.email,
        role: academicCell.role || 'academic-cell'
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin Login
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
