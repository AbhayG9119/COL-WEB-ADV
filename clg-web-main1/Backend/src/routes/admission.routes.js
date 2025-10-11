import express from 'express';
import { submitAdmissionQuery, getAdmissionQueries } from '../controllers/admissionController.js';

const router = express.Router();

// Submit Admission Query
router.post('/', submitAdmissionQuery);

// Get all Admission Queries
router.get('/', getAdmissionQueries);

export default router;
