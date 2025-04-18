import asyncHandler from "../middlewares/asyncHandler.js"; 
import Coupon from "../models/couponModel.js";
import User from "../models/userModel.js";
import UserCoupon from "../models/userCouponModel.js"; // import the user-specific coupon model

// Generate a unique code for user coupons
const generateUniqueCode = () => 'USR-' + Math.random().toString(36).substr(2, 8).toUpperCase();

// Create a coupon (Admin only)
const createCoupon = asyncHandler(async (req, res) => {
  let { templateCode, discountValue, pointCost, description } = req.body;

  if (!templateCode) {
    code = generateUniqueCode();
  }

  const existing = await Coupon.findOne({ templateCode });
  if (existing) {
    return res.status(400).json({ message: 'Coupon code already exists' });
  }

  const coupon = await Coupon.create({ templateCode, discountValue, pointCost, description });
  res.status(201).json(coupon);
});

// Get all available coupon types (public list)
const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find();
  res.json(coupons);
});

// Assign a coupon from a category to a user (creates a unique user coupon)

const assignCoupon = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const templateId = req.params.id;

  const couponTemplate = await Coupon.findById(templateId);
  if (!couponTemplate) {
    return res.status(404).json({ message: 'Coupon template not found' });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (user.points < couponTemplate.pointCost) {
    return res.status(400).json({ message: 'Insufficient points' });
  }

  // Deduct points
  user.points -= couponTemplate.pointCost;
  await user.save();

  // Generate a unique code for this assigned coupon
  const uniqueCode = 'CPN-' + Math.random().toString(36).substr(2, 8).toUpperCase();

  // Save the assigned coupon
  const userCoupon = new UserCoupon({
    user: user._id,
    couponTemplate: couponTemplate._id,
    uniqueCode,
  });

  await userCoupon.save();

  res.json({
    message: 'Coupon assigned successfully',
    userCoupon,
    remainingPoints: user.points,
  });
});


// Get user's assigned coupons
const getUserCoupons = asyncHandler(async (req, res) => {
  const coupons = await UserCoupon.find({ user: req.user._id });
  res.json(coupons);
});

// Delete a coupon type (Admin only)
const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) {
    return res.status(404).json({ message: 'Coupon not found' });
  }

  res.json({ message: 'Coupon deleted successfully', coupon });
});

export { createCoupon, getCoupons, assignCoupon, getUserCoupons, deleteCoupon };
