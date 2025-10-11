import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const facultySchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
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
    required: true
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
  }
}, {
  timestamps: true
});

// Hash password before saving
facultySchema.pre('save', async function(next) {
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
facultySchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Faculty = mongoose.model('Faculty', facultySchema);

export default Faculty;
