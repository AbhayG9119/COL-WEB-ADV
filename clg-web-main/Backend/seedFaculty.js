// seedFaculty.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Faculty from './src/models/Faculty.js';

dotenv.config();

async function createFaculty() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    // Faculty details for testing
    const email = 'testfaculty@example.com';
    const plainPassword = 'TestPass123';
    const username = 'Test Faculty';
    const department = 'Computer Science';
    const subject = 'Computer Science';

    // Check if faculty already exists
    const existing = await Faculty.findOne({ email });
    if (existing) {
      console.log('⚠️ Faculty already exists:', existing.email);
      // Update department and subject if changed
      existing.department = department;
      existing.subject = subject;
      await existing.save();
      console.log('🔄 Faculty updated successfully:', existing.email);
      return;
    }

    // Create new faculty (password will be hashed by schema pre-save hook)
    const faculty = new Faculty({
      username,
      email,
      password: plainPassword,
      department,
      subject,
      role: 'faculty'
    });

    await faculty.save();
    console.log('🎉 Faculty created successfully:', email);
  } catch (err) {
    console.error('❌ Error creating faculty:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 MongoDB disconnected');
  }
}

createFaculty();
