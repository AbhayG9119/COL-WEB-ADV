import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

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
  course: { type: String, default: 'B.A' },
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

  // Qualification Details
  qualifications: [qualificationDetailSchema],

  // Year/Semester Result Details
  semesterResults: [semesterResultSchema],

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
}, { timestamps: true });

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
