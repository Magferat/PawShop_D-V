import express from 'express';
import {
  createCoupon,
  getCoupons,
  assignCoupon,
  getUserCoupons,
  deleteCoupon,
  useCoupon, 
} from '../controllers/couponController.js';

import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Admin: Create a new coupon type
router.post('/', authenticate, authorizeAdmin, createCoupon);

// Public: View all available coupon types
router.get('/', getCoupons);

// User: Redeem a coupon (increase quantity)
router.patch('/:id/redeem', authenticate, assignCoupon);

// User: Use one quantity of a coupon
router.patch('/:id/use', authenticate, useCoupon); //Route to decrement quantity

// User: Get all coupons assigned to the logged-in user
router.get('/my-coupons', authenticate, getUserCoupons);

// Admin: Delete a coupon type (removes from public list)
router.delete('/:id', authenticate, authorizeAdmin, deleteCoupon);

export default router;
