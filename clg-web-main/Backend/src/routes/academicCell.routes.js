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
import uploadDocument, { uploadAdmissionPhoto, handleUploadError } from '../middleware/fileUpload.js';

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
    const studentId = req.params.id;

    // Validate required fields
    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: 'Student ID is required'
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    // Validate status values
    const validStatuses = ['active', 'inactive', 'suspended', 'graduated', 'transferred'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      });
    }

    // Validate remarks length if provided
    if (remarks && remarks.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'Remarks cannot exceed 500 characters'
      });
    }

    const student = await Student.findByIdAndUpdate(
      studentId,
      { status, remarks },
      { new: true, runValidators: true }
    ).select('-password');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.json({
      success: true,
      message: 'Student status updated successfully',
      data: student
    });
  } catch (error) {
    console.error('Error updating student status:', error);

    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error: ' + Object.values(error.errors).map(err => err.message).join(', ')
      });
    }

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid student ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error while updating student status'
    });
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

// Create or update student profile
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

    if (!profileData.rollNumber) {
      return res.status(400).json({
        success: false,
        message: 'Roll number is required'
      });
    }

    if (!profileData.course) {
      return res.status(400).json({
        success: false,
        message: 'Course is required'
      });
    }

    if (!profileData.branch) {
      return res.status(400).json({
        success: false,
        message: 'Branch is required'
      });
    }

    // Check if student exists
    const student = await Student.findById(profileData.student);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Check if profile already exists for this student
    const existingProfile = await DetailedStudentProfile.findOne({ student: profileData.student });

    let profile;
    if (existingProfile) {
      // Update existing profile
      profile = await DetailedStudentProfile.findByIdAndUpdate(
        existingProfile._id,
        {
          rollNumber: profileData.rollNumber,
          course: profileData.course,
          branch: profileData.branch,
          fatherName: profileData.fatherName,
          motherName: profileData.motherName,
          dateOfBirth: profileData.dateOfBirth,
          religion: profileData.religion,
          caste: profileData.caste,
          domicile: profileData.domicile,
          aadharNumber: profileData.aadharNumber,
          college: profileData.college,
          admissionDate: profileData.admissionDate,
          admissionMode: profileData.admissionMode,
          admissionSession: profileData.admissionSession,
          academicSession: profileData.academicSession,
          currentYear: profileData.currentYear,
          currentSemester: profileData.currentSemester,
          currentAcademicStatus: profileData.currentAcademicStatus,
          scholarshipApplied: profileData.scholarshipApplied,
          hostelApplied: profileData.hostelApplied,
          contactNumber: profileData.contactNumber,
          fatherContactNumber: profileData.fatherContactNumber,
          correspondenceAddress: profileData.correspondenceAddress,
          permanentAddress: profileData.permanentAddress,
          email: profileData.email,
          qualifications: profileData.qualifications || [],
          semesterResults: profileData.semesterResults || [],
          documents: profileData.documents || []
        },
        { new: true, runValidators: true }
      );
    } else {
      // Create new profile
      const newProfile = new DetailedStudentProfile({
        student: profileData.student,
        rollNumber: profileData.rollNumber,
        course: profileData.course,
        branch: profileData.branch,
        fatherName: profileData.fatherName,
        motherName: profileData.motherName,
        dateOfBirth: profileData.dateOfBirth,
        religion: profileData.religion,
        caste: profileData.caste,
        domicile: profileData.domicile,
        aadharNumber: profileData.aadharNumber,
        college: profileData.college,
        admissionDate: profileData.admissionDate,
        admissionMode: profileData.admissionMode,
        admissionSession: profileData.admissionSession,
        academicSession: profileData.academicSession,
        currentYear: profileData.currentYear,
        currentSemester: profileData.currentSemester,
        currentAcademicStatus: profileData.currentAcademicStatus,
        scholarshipApplied: profileData.scholarshipApplied,
        hostelApplied: profileData.hostelApplied,
        contactNumber: profileData.contactNumber,
        fatherContactNumber: profileData.fatherContactNumber,
        correspondenceAddress: profileData.correspondenceAddress,
        permanentAddress: profileData.permanentAddress,
        email: profileData.email,
        qualifications: profileData.qualifications || [],
        semesterResults: profileData.semesterResults || [],
        documents: profileData.documents || []
      });

      profile = await newProfile.save();
    }

    // Populate the student data for response
    const populatedProfile = await DetailedStudentProfile.findById(profile._id)
      .populate('student', 'username email studentId department')
      .populate('documents.documentId');

    res.status(existingProfile ? 200 : 201).json({
      success: true,
      message: existingProfile ? 'Student profile updated successfully' : 'Student profile created successfully',
      data: populatedProfile
    });
  } catch (error) {
    console.error('Error saving student profile:', error);

    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error: ' + Object.values(error.errors).map(err => err.message).join(', ')
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Student profile already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error while saving student profile'
    });
  }
});

// Save detailed profile with documents (integrated admission form)
router.post('/admission-form', async (req, res) => {
  try {
    const formData = req.body;

    // Validate required fields
    if (!formData.student) {
      return res.status(400).json({
        success: false,
        message: 'Student ID is required'
      });
    }

    if (!formData.rollNumber) {
      return res.status(400).json({
        success: false,
        message: 'Roll number is required'
      });
    }

    if (!formData.course) {
      return res.status(400).json({
        success: false,
        message: 'Course is required'
      });
    }

    if (!formData.branch) {
      return res.status(400).json({
        success: false,
        message: 'Branch is required'
      });
    }

    if (!formData.fatherName) {
      return res.status(400).json({
        success: false,
        message: 'Father name is required'
      });
    }

    if (!formData.motherName) {
      return res.status(400).json({
        success: false,
        message: 'Mother name is required'
      });
    }

    if (!formData.dateOfBirth) {
      return res.status(400).json({
        success: false,
        message: 'Date of birth is required'
      });
    }

    if (!formData.aadharNumber) {
      return res.status(400).json({
        success: false,
        message: 'Aadhar number is required'
      });
    }

    // Validate Aadhar number format (12 digits)
    if (!/^\d{12}$/.test(formData.aadharNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Aadhar number must be exactly 12 digits'
      });
    }

    // Check if student exists
    const student = await Student.findById(formData.student);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Check if profile already exists for this student
    const existingProfile = await DetailedStudentProfile.findOne({ student: formData.student });

    let profile;
    if (existingProfile) {
      // Update existing profile
      profile = await DetailedStudentProfile.findByIdAndUpdate(
        existingProfile._id,
        {
          rollNumber: formData.rollNumber,
          course: formData.course,
          branch: formData.branch,
          fatherName: formData.fatherName,
          motherName: formData.motherName,
          dateOfBirth: formData.dateOfBirth,
          religion: formData.religion,
          caste: formData.caste,
          domicile: formData.domicile,
          aadharNumber: formData.aadharNumber,
          college: formData.college,
          admissionDate: formData.admissionDate,
          admissionMode: formData.admissionMode,
          admissionSession: formData.admissionSession,
          academicSession: formData.academicSession,
          currentYear: formData.currentYear,
          currentSemester: formData.currentSemester,
          currentAcademicStatus: formData.currentAcademicStatus,
          scholarshipApplied: formData.scholarshipApplied,
          hostelApplied: formData.hostelApplied,
          contactNumber: formData.contactNumber,
          fatherContactNumber: formData.fatherContactNumber,
          correspondenceAddress: formData.correspondenceAddress,
          permanentAddress: formData.permanentAddress,
          email: formData.email,
          qualifications: formData.qualifications || [],
          semesterResults: formData.semesterResults || [],
          documents: formData.documents || []
        },
        { new: true, runValidators: true }
      );
    } else {
      // Create new profile
      const newProfile = new DetailedStudentProfile({
        student: formData.student,
        rollNumber: formData.rollNumber,
        course: formData.course,
        branch: formData.branch,
        fatherName: formData.fatherName,
        motherName: formData.motherName,
        dateOfBirth: formData.dateOfBirth,
        religion: formData.religion,
        caste: formData.caste,
        domicile: formData.domicile,
        aadharNumber: formData.aadharNumber,
        college: formData.college,
        admissionDate: formData.admissionDate,
        admissionMode: formData.admissionMode,
        admissionSession: formData.admissionSession,
        academicSession: formData.academicSession,
        currentYear: formData.currentYear,
        currentSemester: formData.currentSemester,
        currentAcademicStatus: formData.currentAcademicStatus,
        scholarshipApplied: formData.scholarshipApplied,
        hostelApplied: formData.hostelApplied,
        contactNumber: formData.contactNumber,
        fatherContactNumber: formData.fatherContactNumber,
        correspondenceAddress: formData.correspondenceAddress,
        permanentAddress: formData.permanentAddress,
        email: formData.email,
        qualifications: formData.qualifications || [],
        semesterResults: formData.semesterResults || [],
        documents: formData.documents || []
      });

      profile = await newProfile.save();
    }

    // Populate the student data for response
    const populatedProfile = await DetailedStudentProfile.findById(profile._id)
      .populate('student', 'username email studentId department')
      .populate('documents.documentId');

    res.status(existingProfile ? 200 : 201).json({
      success: true,
      message: existingProfile ? 'Admission form updated successfully' : 'Admission form saved successfully',
      data: populatedProfile
    });
  } catch (error) {
    console.error('Error saving admission form:', error);

    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error: ' + Object.values(error.errors).map(err => err.message).join(', ')
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Student profile already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error while saving admission form'
    });
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

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Course name is required'
      });
    }

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Course code is required'
      });
    }

    if (!department) {
      return res.status(400).json({
        success: false,
        message: 'Department is required'
      });
    }

    // Validate credits (should be a positive number)
    if (credits !== undefined && (isNaN(credits) || credits < 0)) {
      return res.status(400).json({
        success: false,
        message: 'Credits must be a positive number'
      });
    }

    // Validate semester (should be between 1 and 8)
    if (semester !== undefined && (isNaN(semester) || semester < 1 || semester > 8)) {
      return res.status(400).json({
        success: false,
        message: 'Semester must be between 1 and 8'
      });
    }

    // Validate course name length
    if (name.length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Course name cannot exceed 100 characters'
      });
    }

    // Validate course code length
    if (code.length > 20) {
      return res.status(400).json({
        success: false,
        message: 'Course code cannot exceed 20 characters'
      });
    }

    const course = new Course({ name, code, department, credits, semester });
    await course.save();

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course
    });
  } catch (error) {
    console.error('Error creating course:', error);

    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error: ' + Object.values(error.errors).map(err => err.message).join(', ')
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Course with this code already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error while creating course'
    });
  }
});

// Update course
router.put('/courses/:id', async (req, res) => {
  try {
    const courseId = req.params.id;
    const updateData = req.body;

    // Validate course ID format
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required'
      });
    }

    // Validate update data
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No update data provided'
      });
    }

    // Validate course name length if provided
    if (updateData.name && updateData.name.length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Course name cannot exceed 100 characters'
      });
    }

    // Validate course code length if provided
    if (updateData.code && updateData.code.length > 20) {
      return res.status(400).json({
        success: false,
        message: 'Course code cannot exceed 20 characters'
      });
    }

    // Validate credits if provided (should be a positive number)
    if (updateData.credits !== undefined && (isNaN(updateData.credits) || updateData.credits < 0)) {
      return res.status(400).json({
        success: false,
        message: 'Credits must be a positive number'
      });
    }

    // Validate semester if provided (should be between 1 and 8)
    if (updateData.semester !== undefined && (isNaN(updateData.semester) || updateData.semester < 1 || updateData.semester > 8)) {
      return res.status(400).json({
        success: false,
        message: 'Semester must be between 1 and 8'
      });
    }

    const course = await Course.findByIdAndUpdate(
      courseId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.json({
      success: true,
      message: 'Course updated successfully',
      data: course
    });
  } catch (error) {
    console.error('Error updating course:', error);

    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error: ' + Object.values(error.errors).map(err => err.message).join(', ')
      });
    }

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid course ID format'
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Course with this code already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error while updating course'
    });
  }
});

// Delete course
router.delete('/courses/:id', async (req, res) => {
  try {
    const courseId = req.params.id;

    // Validate course ID format
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required'
      });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if course is being used by any students
    const studentsUsingCourse = await Student.countDocuments({
      'documents.documentType': 'course_enrollment',
      'documents.metadata.courseId': courseId
    });

    if (studentsUsingCourse > 0) {
      return res.status(409).json({
        success: false,
        message: `Cannot delete course. ${studentsUsingCourse} student(s) are currently enrolled in this course`
      });
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId);

    res.json({
      success: true,
      message: 'Course deleted successfully',
      data: {
        deletedCourse: {
          id: course._id,
          name: course.name,
          code: course.code
        }
      }
    });
  } catch (error) {
    console.error('Error deleting course:', error);

    // Handle specific MongoDB errors
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid course ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error while deleting course'
    });
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

// Enhanced Document Management with Specific Document Types
// Get documents by student ID
router.get('/students/:studentId/documents', async (req, res) => {
  try {
    const { studentId } = req.params;
    const documents = await Document.find({ student: studentId })
      .populate('student', 'username email studentId')
      .sort({ uploadedAt: -1 });

    res.json({
      success: true,
      data: documents
    });
  } catch (error) {
    console.error('Error fetching student documents:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload document for a student
router.post('/students/:studentId/documents', uploadDocument, handleUploadError, async (req, res) => {
  try {
    const { studentId } = req.params;
    const { documentType, remarks } = req.body;

    // Validate required fields
    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: 'Student ID is required'
      });
    }

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

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file type. Only JPG, JPEG, PNG, and PDF files are allowed'
      });
    }

    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Create document record
    const document = new Document({
      student: studentId,
      documentType,
      fileName: req.file.originalname,
      filePath: 'memory', // Since we're using memory storage
      fileData: req.file.buffer,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      status: 'pending',
      remarks: remarks || '',
      uploadedBy: req.user._id
    });

    await document.save();

    // Update student document reference
    const documentRef = {
      documentType,
      documentId: document._id,
      status: 'pending',
      uploadedAt: new Date()
    };

    await Student.findByIdAndUpdate(studentId, {
      $push: { documents: documentRef }
    });

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      data: document
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

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Document already exists for this student and type'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error while uploading document'
    });
  }
});

// Upload admission photo for a student (only images allowed)
router.post('/students/:studentId/admission-photo', uploadAdmissionPhoto, handleUploadError, async (req, res) => {
  try {
    const { studentId } = req.params;
    const { photoType, remarks } = req.body;

    // Validate required fields
    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: 'Student ID is required'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No photo uploaded'
      });
    }

    // Validate file size (2MB limit for photos)
    if (req.file.size > 2 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: 'Photo size should not exceed 2MB'
      });
    }

    // Validate file type (only images)
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedImageTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file type. Only JPG, JPEG, and PNG images are allowed'
      });
    }

    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Create document record for admission photo
    const document = new Document({
      student: studentId,
      documentType: photoType || 'admission_photo',
      fileName: req.file.originalname,
      filePath: req.file.path, // File path since we're using disk storage
      fileData: null, // No buffer data for disk storage
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      status: 'pending',
      remarks: remarks || '',
      uploadedBy: req.user._id
    });

    await document.save();

    // Update student document reference
    const documentRef = {
      documentType: photoType || 'admission_photo',
      documentId: document._id,
      status: 'pending',
      uploadedAt: new Date()
    };

    await Student.findByIdAndUpdate(studentId, {
      $push: { documents: documentRef }
    });

    res.status(201).json({
      success: true,
      message: 'Admission photo uploaded successfully',
      data: {
        documentId: document._id,
        fileName: req.file.originalname,
        filePath: req.file.path,
        mimeType: req.file.mimetype,
        size: req.file.size
      }
    });
  } catch (error) {
    console.error('Error uploading admission photo:', error);

    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error: ' + Object.values(error.errors).map(err => err.message).join(', ')
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Photo already exists for this student and type'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error while uploading photo'
    });
  }
});

// Update document status
router.patch('/documents/:id/status', async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const document = await Document.findByIdAndUpdate(
      req.params.id,
      {
        status,
        remarks,
        verifiedBy: req.user._id,
        verifiedAt: status !== 'pending' ? new Date() : null
      },
      { new: true }
    ).populate('student', 'username email studentId');

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Update student document reference status
    await Student.updateOne(
      { 'documents.documentId': req.params.id },
      { $set: { 'documents.$.status': status } }
    );

    res.json({
      success: true,
      message: 'Document status updated successfully',
      data: document
    });
  } catch (error) {
    console.error('Error updating document status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete document
router.delete('/documents/:id', async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Remove document reference from student
    await Student.updateOne(
      { 'documents.documentId': req.params.id },
      { $pull: { documents: { documentId: req.params.id } } }
    );

    // Delete document record
    await Document.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get document file data
router.get('/documents/:id/file', async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.set({
      'Content-Type': document.mimeType,
      'Content-Disposition': `inline; filename="${document.fileName}"`,
      'Content-Length': document.fileData.length
    });

    res.send(document.fileData);
  } catch (error) {
    console.error('Error fetching document file:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update student contact information
router.patch('/students/:id/contact', async (req, res) => {
  try {
    const { mobileNumber, emailId } = req.body;
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { mobileNumber, emailId },
      { new: true }
    ).select('-password');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({
      success: true,
      message: 'Student contact information updated successfully',
      data: student
    });
  } catch (error) {
    console.error('Error updating student contact:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get document statistics
router.get('/documents/stats', async (req, res) => {
  try {
    const totalDocuments = await Document.countDocuments();
    const pendingDocuments = await Document.countDocuments({ status: 'pending' });
    const verifiedDocuments = await Document.countDocuments({ status: 'verified' });
    const rejectedDocuments = await Document.countDocuments({ status: 'rejected' });

    const documentTypeStats = await Document.aggregate([
      { $group: { _id: '$documentType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        total: totalDocuments,
        pending: pendingDocuments,
        verified: verifiedDocuments,
        rejected: rejectedDocuments,
        byType: documentTypeStats
      }
    });
  } catch (error) {
    console.error('Error fetching document statistics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all documents from student profiles (DetailedStudentProfile)
router.get('/documents/profiles', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || '';
    const skip = (page - 1) * limit;

    // Get all student profiles with documents
    const profiles = await DetailedStudentProfile.find()
      .populate('student', 'username email studentId')
      .sort({ createdAt: -1 });

    // Flatten documents with profile information
    let allDocuments = [];
    profiles.forEach(profile => {
      if (profile.documents && profile.documents.length > 0) {
        profile.documents.forEach(doc => {
          allDocuments.push({
            _id: `${profile._id}-${doc.documentType}`,
            student: profile.student,
            documentType: doc.documentType,
            status: doc.status || 'pending',
            uploadedAt: doc.uploadedAt,
            remarks: doc.remarks,
            profileId: profile._id,
            profile: profile
          });
        });
      }
    });

    // Filter by status if provided
    if (status) {
      allDocuments = allDocuments.filter(doc => doc.status === status);
    }

    // Sort by upload date (newest first)
    allDocuments.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

    // Pagination
    const total = allDocuments.length;
    const paginatedDocuments = allDocuments.slice(skip, skip + limit);

    res.json({
      success: true,
      data: paginatedDocuments,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Error fetching profile documents:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get document file from student profile
router.get('/documents/profiles/:profileId/:documentType/file', async (req, res) => {
  try {
    const { profileId, documentType } = req.params;

    const profile = await DetailedStudentProfile.findById(profileId)
      .populate('student', 'username email studentId');

    if (!profile) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    const document = profile.documents.find(doc => doc.documentType === documentType);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // If document has file data (stored as buffer)
    if (document.fileData) {
      res.set({
        'Content-Type': document.mimeType || 'application/octet-stream',
        'Content-Disposition': `inline; filename="${document.fileName || documentType}"`,
        'Content-Length': document.fileData.length
      });
      res.send(document.fileData);
    } else {
      return res.status(404).json({ message: 'Document file not available' });
    }
  } catch (error) {
    console.error('Error fetching document file:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify document in student profile
router.patch('/documents/profiles/:profileId/:documentType/verify', async (req, res) => {
  try {
    const { profileId, documentType } = req.params;
    const { status, remarks } = req.body;

    const profile = await DetailedStudentProfile.findById(profileId);

    if (!profile) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    // Find and update the document
    const documentIndex = profile.documents.findIndex(doc => doc.documentType === documentType);

    if (documentIndex === -1) {
      return res.status(404).json({ message: 'Document not found' });
    }

    profile.documents[documentIndex].status = status;
    profile.documents[documentIndex].remarks = remarks;
    profile.documents[documentIndex].verifiedAt = new Date();
    profile.documents[documentIndex].verifiedBy = req.user._id;

    await profile.save();

    // Populate student data for response
    const updatedProfile = await DetailedStudentProfile.findById(profileId)
      .populate('student', 'username email studentId');

    res.json({
      success: true,
      message: 'Document verification updated successfully',
      data: {
        profile: updatedProfile,
        document: profile.documents[documentIndex]
      }
    });
  } catch (error) {
    console.error('Error verifying document:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get documents grouped by student
router.get('/documents/grouped-by-student', async (req, res) => {
  try {
    const profiles = await DetailedStudentProfile.find()
      .populate('student', 'username email studentId')
      .sort({ createdAt: -1 });

    // Group documents by student
    const groupedDocuments = profiles.map(profile => ({
      studentId: profile.student?._id,
      studentName: profile.student?.username || 'N/A',
      studentEmail: profile.student?.email || 'N/A',
      profileId: profile._id,
      documents: profile.documents || []
    })).filter(group => group.documents.length > 0);

    res.json({
      success: true,
      data: groupedDocuments
    });
  } catch (error) {
    console.error('Error fetching grouped documents:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
