import express from 'express';
import multer from 'multer';
import path from 'path';
import Contact from '../models/Contact.js';
import { submitContact, getContacts } from '../controllers/contactController.js';

const router = express.Router({
  strict: true
});

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Submit contact form
router.post('/', upload.single('attachment'), submitContact);

// Get all contacts
router.get('/', getContacts);

// Test MongoDB connection
router.get('/test-db', async (req, res) => {
  try {
    const testContact = new Contact({
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      location: 'Test Location',
      subject: 'Test Subject',
      message: 'Test Message'
    });
    await testContact.save();
    await Contact.findByIdAndDelete(testContact._id);
    res.json({ message: 'MongoDB connection successful' });
  } catch (error) {
    console.error('MongoDB test failed:', error.message);
    res.status(500).json({ message: 'MongoDB connection failed', error: error.message });
  }
});

export default router;
