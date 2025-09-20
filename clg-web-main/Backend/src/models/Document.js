import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  documentType: { type: String, required: true, enum: ['id_proof', 'address_proof', 'marksheet', 'certificate', 'photo', 'other'] },
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  uploadedAt: { type: Date, default: Date.now },
  verifiedAt: { type: Date },
  remarks: { type: String }
});

export default mongoose.model('Document', documentSchema);
