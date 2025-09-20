import mongoose from 'mongoose';

const semesterResultSchema = new mongoose.Schema({
  year: { type: String, required: true },
  semester: { type: String, required: true },
  status: { type: String, required: true },
  marksPercentage: { type: String, required: true },
  carryOverPapers: { type: String, default: 'NIL' }
});

const qualificationDetailSchema = new mongoose.Schema({
  course: { type: String, required: true },
  streamName: { type: String, required: true },
  boardName: { type: String, required: true },
  rollNumber: { type: String, required: true },
  passingYear: { type: String, required: true },
  subjectDetails: { type: String },
  marksPercentage: { type: String, required: true }
});

const detailedStudentProfileSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, unique: true },

  // Personal Profile
  fatherName: { type: String },
  motherName: { type: String },
  dateOfBirth: { type: Date },
  religion: { type: String },
  caste: { type: String },
  domicile: { type: String },
  aadharNumber: { type: String },

  // Academic Profile
  rollNumber: { type: String },
  college: { type: String },
  course: { type: String },
  branch: { type: String },
  admissionDate: { type: Date },
  admissionMode: { type: String },
  admissionSession: { type: String },
  academicSession: { type: String },
  currentYear: { type: String },
  currentSemester: { type: String },
  currentAcademicStatus: { type: String },
  scholarshipApplied: { type: String },

  // Hostel Details
  hostelApplied: { type: String },

  // Contact Details
  contactNumber: { type: String },
  fatherContactNumber: { type: String },
  correspondenceAddress: { type: String },
  permanentAddress: { type: String },
  email: { type: String },

  // Qualification Details
  qualifications: [qualificationDetailSchema],

  // Year/Semester Result Details
  semesterResults: [semesterResultSchema]
}, { timestamps: true });

const DetailedStudentProfile = mongoose.model('DetailedStudentProfile', detailedStudentProfileSchema);

export default DetailedStudentProfile;
