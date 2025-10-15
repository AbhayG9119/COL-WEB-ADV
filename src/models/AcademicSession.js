import mongoose from 'mongoose';

const academicSessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Ensure only one active session at a time
academicSessionSchema.pre('save', async function(next) {
  if (this.isActive) {
    await mongoose.model('AcademicSession').updateMany(
      { _id: { $ne: this._id } },
      { isActive: false }
    );
  }
  next();
});

const AcademicSession = mongoose.model('AcademicSession', academicSessionSchema);

export default AcademicSession;
