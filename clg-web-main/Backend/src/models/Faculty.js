import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const facultySchema = new mongoose.Schema({
  // Basic Information
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  fullName: {
    type: String,
    trim: true
  },
  
  department: {
    type: String,
    required: true
  },
  designation: {
    type: String,
    enum: ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer', 'Senior Lecturer'],
    default: 'Lecturer'
  },
  dateOfJoining: {
    type: Date
  },

  // Contact Details
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  mobileNumber: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },

  // Professional Details
  subject: {
    type: String,
    required: true
  },
  subjectsTaught: [{
    type: String,
    trim: true
  }],
  assignedClasses: [{
    classId: {
      type: String,
      required: true
    },
    className: {
      type: String,
      required: true
    },
    subjects: [{
      subjectId: {
        type: String,
        required: true
      },
      subjectName: {
        type: String,
        required: true
      }
    }]
  }],
  teachingExperience: {
    type: Number,
    min: 0
  },

  // Administrative Roles
  administrativeRoles: [{
    role: { type: String, trim: true },
    description: { type: String, trim: true }
  }],

  // Documents
  idProof: {
    type: String, // file path
    trim: true
  },
  qualificationCertificates: [{
    type: String, // file paths
    trim: true
  }],
  appointmentLetter: {
    type: String, // file path
    trim: true
  },

  // Attendance & Schedule
  weeklyTimetable: {
    type: Map,
    of: [{
      subject: String,
      time: String,
      room: String
    }]
  },
  leaveRecords: [{
    startDate: Date,
    endDate: Date,
    reason: String,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    }
  }],

  // Additional
  profilePicture: {
    type: String, // file path
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'on-leave'],
    default: 'active'
  },

  // Authentication
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    default: 'faculty'
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