import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const couponSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: false, ref: "User" },
    name: { type: String, required: true },
    type: { type: String, enum: ['Discount', 'Services', 'Product'], required: true },
    points: { type: Number, required: true }, 
    discountpercentage: { type: Number, required: false },
    description: { type: String, required: false },
    freeproduct: { type: String, required: false},
    servicename: { type: String, required: false},
  },
  { timestamps: true }
);

const Coupon = mongoose.model("Coupon", couponSchema);
export default Coupon;