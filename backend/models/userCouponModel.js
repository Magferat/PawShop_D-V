import mongoose from 'mongoose';

const UserCouponSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  couponTemplate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon',
    required: true,
  },

  uniqueCode: {
    type: String,
    required: true,
    unique: true,
  },

  redeemedAt: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true,
});

const UserCoupon = mongoose.model('UserCoupon', UserCouponSchema);
export default UserCoupon;
