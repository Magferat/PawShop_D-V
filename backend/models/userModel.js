// models/userModel.js
import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  isAdmin: {
    type: Boolean,
    default: false,
  },

  points: {
    type: Number,
    default: 50,
  },

  assignedCoupons: [
    {
      code: String,
      discountValue: Number,
      pointCost: Number,
      description: String,
      templateCode: String,
      redeemedAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
  
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
