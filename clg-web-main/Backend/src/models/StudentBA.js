import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const studentBASchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  department: { type: String, default: 'B.A' },
  year: { type: Number, required: true },  // Added year field
  semester: { type: Number, required: true },  // Added semester field
  profilePicture: { type: String },
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
studentBASchema.pre('save', async function(next) {
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
studentBASchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const StudentBA = mongoose.model('StudentBA', studentBASchema);

export default StudentBA;
