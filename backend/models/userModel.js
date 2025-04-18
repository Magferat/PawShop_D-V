import mongoose from "mongoose";

const userreviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

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

    reviews: [userreviewSchema],
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },


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
