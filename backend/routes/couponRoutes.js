import express from 'express';
import {
  createCoupon,
  getCoupons,
  assignCoupon,
  getUserCoupons,
  deleteCoupon,
} from '../controllers/couponController.js';

import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Admin: Create a new coupon type
router.post('/', authenticate, authorizeAdmin, createCoupon);

// Public: View all available coupon types
router.get('/', getCoupons);

// User: Redeem a coupon (assign unique to user)
router.patch('/:id/redeem', authenticate, assignCoupon);

// User: Get all coupons assigned to the logged-in user
router.get('/my-coupons', authenticate, getUserCoupons);

// Admin: Delete a coupon type
router.delete('/:id', authenticate, authorizeAdmin, deleteCoupon);

export default router;
