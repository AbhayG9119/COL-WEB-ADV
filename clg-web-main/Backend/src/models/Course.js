import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  credits: { type: Number, default: 0 },
  type: { type: String, enum: ['core', 'elective', 'practical'], default: 'core' }
});

const semesterSchema = new mongoose.Schema({
  semesterNumber: { type: Number, required: true },
  subjects: [subjectSchema]
});

const courseSchema = new mongoose.Schema({
  department: { type: String, required: true, enum: ['B.Sc', 'B.A', 'B.Ed'] },
  courseName: { type: String, required: true },
  duration: { type: Number, default: 3 }, // years
  totalSemesters: { type: Number, default: 6 },
  semesters: [semesterSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Course', courseSchema);
