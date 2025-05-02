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
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
}, {
  timestamps: true,
});

const UserCoupon = mongoose.model('UserCoupon', UserCouponSchema);
export default UserCoupon;
