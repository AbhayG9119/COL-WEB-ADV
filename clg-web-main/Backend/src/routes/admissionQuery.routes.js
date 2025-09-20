import express from 'express';
import multer from 'multer';
import path from 'path';
import AdmissionQuery from '../models/AdmissionQuery.js';

const router = express.Router({
  strict: true
});

// Set up multer for file uploads (if needed in future)
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

// Submit admission query form
router.post('/', upload.none(), async (req, res) => {
  try {
    const { name, email, phone, location, pincode, course, message } = req.body;
    const admissionQuery = new AdmissionQuery({ name, email, phone, location, pincode, course, message });
    await admissionQuery.save();

    res.status(201).json({ message: 'Admission query submitted successfully' });
  } catch (error) {
    console.error('Error submitting admission query:', error.message);
    res.status(500).json({ message: 'Failed to submit admission query. Please try again.' });
  }
});

// Get all admission queries (admin only)
router.get('/', async (req, res) => {
  try {
    const queries = await AdmissionQuery.find().sort({ createdAt: -1 });
    res.json(queries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
