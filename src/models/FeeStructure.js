import mongoose from 'mongoose';

const feeHeadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  isMandatory: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    trim: true
  }
});

const feeStructureSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AcademicSession',
    required: true
  },
  classId: {
    type: String,
    required: true,
    trim: true
  },
  feeHeads: [feeHeadSchema],
  totalAmount: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Calculate total amount before saving
feeStructureSchema.pre('save', function(next) {
  this.totalAmount = this.feeHeads.reduce((total, head) => total + head.amount, 0);
  next();
});

const FeeStructure = mongoose.model('FeeStructure', feeStructureSchema);

export default FeeStructure;
