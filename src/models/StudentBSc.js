import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const studentSchema = new mongoose.Schema({
  // Basic Information
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  middleName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  mobileNumber: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'student'
  },

  // Academic Details
  rollNo: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  department: {
    type: String,
    required: true,
    enum: ['B.A', 'B.Sc', 'B.Ed']
  },
  year: {
    type: Number,
    required: true
  },
  semester: {
    type: Number,
    required: true
  },
  section: {
    type: String,
    trim: true
  },

  // Personal Details
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other']
  },
  bloodGroup: {
    type: String,
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  guardianName: {
    type: String,
    required: true,
    trim: true
  },
  guardianContact: {
    type: String,
    required: true,
    trim: true
  },

  // Security
  securityQuestion: {
    type: String,
    required: true
  },
  securityAnswer: {
    type: String,
    required: true
  },

  // Uploads
  profilePhoto: {
    type: String, // File path
    trim: true
  },
  idProof: {
    type: String, // File path
    trim: true
  },

  // Verification
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isMobileVerified: {
    type: Boolean,
    default: true
  },
  emailOTP: {
    type: String,
    trim: true
  },
  mobileOTP: {
    type: String,
    trim: true
  },
  otpExpiry: {
    type: Date
  },

  // Auto-generated
  studentId: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});

// Auto-generate studentId before saving
studentSchema.pre('save', async function(next) {
  if (this.isNew && !this.studentId) {
    try {
      const count = await mongoose.model('StudentBSc').countDocuments();
      this.studentId = `STU${String(count + 1).padStart(6, '0')}`;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Hash password before saving
studentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
studentSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const StudentBSc = mongoose.model('StudentBSc', studentSchema);

export default StudentBSc;
