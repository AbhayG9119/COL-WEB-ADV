import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const facultySchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  department: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  subjectsTaught: [{
    type: String
  }],
  role: {
    type: String,
    default: 'faculty'
  },
  // Enhanced profile fields
  fullName: {
    type: String,
    trim: true
  },
  employeeId: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  designation: {
    type: String,
    trim: true
  },
  dateOfJoining: {
    type: Date
  },
  officialEmail: {
    type: String,
    lowercase: true,
    trim: true
  },
  mobileNumber: {
    type: String,
    trim: true
  },
  officeRoom: {
    type: String,
    trim: true
  },
  teachingExperience: {
    type: String,
    trim: true
  },
  specialization: [{
    type: String
  }],
  researchInterests: [{
    type: String
  }],
  publications: [{
    type: String
  }],
  certifications: [{
    type: String
  }],
  achievements: [{
    type: String
  }],
  administrativeRoles: [{
    type: String
  }],
  weeklyTimetable: {
    type: mongoose.Schema.Types.Mixed
  },
  leaveRecords: [{
    type: mongoose.Schema.Types.Mixed
  }],
  shortBio: {
    type: String,
    trim: true
  },
  officeHours: {
    type: String,
    trim: true
  },
  // Document fields
  profilePicture: {
    type: String
  },
  idProof: {
    type: String
  },
  qualificationCertificates: [{
    type: String
  }],
  appointmentLetter: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
facultySchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
facultySchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Faculty = mongoose.model('Faculty', facultySchema);

export default Faculty;
