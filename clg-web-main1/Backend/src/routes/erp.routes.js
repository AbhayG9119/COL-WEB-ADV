import express from 'express';
import {
  createSession,
  activateSession,
  getSessions,
  createFeeStructure,
  getFeeStructures,
  createTransportRoute,
  assignTransportToStudent,
  getTransportRoutes,
  createHostelFee,
  assignHostelToStudent,
  getHostelFees,
  applyDiscount,
  getDiscounts,
  createSubject,
  getSubjects,
  generateFeeReceipt
} from '../controllers/erpController.js';

const router = express.Router();

// Session routes
router.post('/session', createSession);
router.put('/session/:sessionId/activate', activateSession);
router.get('/sessions', getSessions);

// Fee structure routes
router.post('/fee/structure', createFeeStructure);
router.get('/fee/structures', getFeeStructures);

// Transport routes
router.post('/transport', createTransportRoute);
router.post('/transport/assign', assignTransportToStudent);
router.get('/transport/routes', getTransportRoutes);

// Hostel routes
router.post('/hostel/fee', createHostelFee);
router.post('/hostel/assign', assignHostelToStudent);
router.get('/hostel/fees', getHostelFees);

// Discount routes
router.post('/discount', applyDiscount);
router.get('/discounts', getDiscounts);

// Subject routes
router.post('/subject', createSubject);
router.get('/subjects', getSubjects);

// Fee receipt routes
router.get('/fee/receipt/:studentId/:sessionId', generateFeeReceipt);

export default router;
