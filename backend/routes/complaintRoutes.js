import express from 'express';
import {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  deleteComplaint,
} from '../controllers/complaintController.js';

import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// 👤 Authenticated user can submit a complaint
router.post('/', authenticate, createComplaint);

// 👤 Authenticated user can view their own complaints (with optional filters)
router.get('/mine', authenticate, getMyComplaints);

// 🛡️ Admin can view all complaints with optional filters
router.get('/', authenticate, authorizeAdmin, getAllComplaints);

// 🛡️ Admin can delete any complaint by ID
router.delete('/:id', authenticate, authorizeAdmin, deleteComplaint);

export default router;
