import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty',
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Class Test1', 'Class Test2', 'Semester', 'Yearly'],
    required: true
  },
  marks: {
    type: Number,
    required: true,
    min: 0
  },
  maxMarks: {
    type: Number,
    required: true,
    min: 1
  },
  grade: {
    type: String,
    enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'],
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  semester: {
    type: Number,
    min: 1,
    max: 8
  },
  year: {
    type: Number,
    min: 1,
    max: 4
  },
  department: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate results for same student, subject, category, semester/year
resultSchema.index({
  studentId: 1,
  subject: 1,
  category: 1,
  semester: 1,
  year: 1
}, {
  unique: true,
  partialFilterExpression: {
    semester: { $exists: true },
    year: { $exists: true }
  }
});

// For class tests (no semester/year)
resultSchema.index({
  studentId: 1,
  subject: 1,
  category: 1,
  date: 1
}, {
  unique: true,
  partialFilterExpression: {
    category: { $in: ['Class Test1', 'Class Test2'] }
  }
});

const Result = mongoose.model('Result', resultSchema);

export default Result;
