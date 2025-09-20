import mongoose from 'mongoose';

const communicationTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subject: { type: String, required: true },
  body: { type: String, required: true },
  type: { type: String, enum: ['email', 'sms', 'notification'], default: 'email' },
  variables: [{ type: String }], // e.g., ['studentName', 'courseName']
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('CommunicationTemplate', communicationTemplateSchema);
