import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const hodSchema = new mongoose.Schema({
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
  role: {
    type: String,
    default: 'hod'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
hodSchema.pre('save', async function (next) {
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
hodSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Hod = mongoose.model('Hod', hodSchema);

export default Hod;
