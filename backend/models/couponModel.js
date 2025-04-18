import mongoose from 'mongoose';

const CouponSchema = new mongoose.Schema({
  templateCode: { // e.g., "25-OFF-GROOM"
    type: String,
    required: true,
    unique: true,
  },
  discountValue: {
    type: Number,
    required: true,
  },
  pointCost: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const Coupon = mongoose.model('Coupon', CouponSchema);
export default Coupon;
