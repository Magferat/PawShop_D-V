import mongoose from 'mongoose';
import asyncHandler from "../middlewares/asyncHandler.js"; 
import Coupon from "../models/couponModel.js";
import User from "../models/userModel.js";
import UserCoupon from "../models/userCouponModel.js";

// Admin: Create a coupon template
const createCoupon = asyncHandler(async (req, res) => {
  const { templateCode, discountValue, pointCost, description } = req.body;

  if (!templateCode || !discountValue || !pointCost) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const existing = await Coupon.findOne({ templateCode });
  if (existing) {
    return res.status(400).json({ message: 'Coupon code already exists' });
  }

  const coupon = await Coupon.create({ templateCode, discountValue, pointCost, description });
  res.status(201).json(coupon);
});

// Public: Get all available coupon templates
const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find();
  res.json(coupons);
});

// User: Redeem a coupon from a template
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

  let userCoupon = await UserCoupon.findOne({
    user: user._id,
    couponTemplate: couponTemplate._id,
  });

  if (userCoupon) {
    userCoupon.quantity += 1;
    await userCoupon.save();
  } else {
    userCoupon = await UserCoupon.create({
      user: user._id,
      couponTemplate: couponTemplate._id,
      quantity: 1,
    });
  }

  user.points -= couponTemplate.pointCost;
  await user.save();

  res.status(200).json({
    message: 'Coupon assigned successfully',
    userCoupon,
    remainingPoints: user.points,
  });
});

// User: Get their redeemed coupons
const getUserCoupons = asyncHandler(async (req, res) => {
  const coupons = await UserCoupon.find({ user: req.user._id }).populate('couponTemplate');
  res.json(coupons);
});

// Admin: Delete a coupon template
const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) {
    return res.status(404).json({ message: 'Coupon not found' });
  }

  res.json({ message: 'Coupon deleted successfully', coupon });
});

// User: Use a coupon (decrease quantity or remove if 0)
const useCoupon = asyncHandler(async (req, res) => {
  const userCoupon = await UserCoupon.findOne({
    user: req.user._id,
    couponTemplate: req.params.id,
  });

  if (!userCoupon || userCoupon.quantity <= 0) {
    return res.status(400).json({ message: 'No such coupon available' });
  }

  userCoupon.quantity -= 1;

  if (userCoupon.quantity === 0) {
    await userCoupon.deleteOne();
  } else {
    await userCoupon.save();
  }

  res.json({ message: 'Coupon used successfully' });
});

export {
  createCoupon,
  getCoupons,
  assignCoupon,
  getUserCoupons,
  deleteCoupon,
  useCoupon
};
