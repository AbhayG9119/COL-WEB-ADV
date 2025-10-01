import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const studentSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  department: { type: String },
  profilePicture: { type: String }, // URL or path to profile picture
  role: { type: String, default: 'student' },
  createdAt: { type: Date, default: Date.now },
  // Document references
  documents: [{
    documentType: {
      type: String,
      enum: [
        '10th_marksheet',
        '12th_marksheet',
        'aadhar_card',
        'income_certificate',
        'caste_certificate',
        'bank_passbook',
        'transfer_certificate',
        'photo',
        'signature',
        'mobile_number',
        'email_id'
      ]
    },
    documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
    status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
    uploadedAt: { type: Date, default: Date.now }
  }],
  // Contact information (can be updated by academic cell)
  mobileNumber: { type: String },
  emailId: { type: String }
});

// Password hashing middleware
studentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Password comparison method
studentSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Student = mongoose.model('Student', studentSchema);

export default Student;
