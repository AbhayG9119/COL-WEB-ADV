import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  documentType: {
    type: String,
    required: true,
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
  fileName: { type: String, required: true },
  filePath: { type: String, default: 'memory' },
  fileData: { type: Buffer, required: true }, // Store file as binary data
  fileSize: { type: Number, required: true },
  mimeType: { type: String, required: true },
  status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  uploadedAt: { type: Date, default: Date.now },
  verifiedAt: { type: Date },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' },
  remarks: { type: String },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicCell', required: true }
});

export default mongoose.model('Document', documentSchema);
