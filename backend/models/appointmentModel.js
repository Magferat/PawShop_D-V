import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  packageId: { type: mongoose.Schema.Types.ObjectId, required: true }, // references package within service
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true }, // calculated dynamically during booking
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  notes: { type: String },
  packageDuration: { type: Number, required: true },   //in minutes
  googleEventId: { type: String }, 
  couponUsed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserCoupon'
  }
}, { timestamps: true });

export default mongoose.model('Appointment', appointmentSchema);
