import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  date: { type: Date, required: true },
  subject: { type: String, required: true },
  status: { type: String, enum: ['present', 'absent', 'late'], required: true }
}, { timestamps: true });

export default mongoose.model('Attendance', attendanceSchema);
