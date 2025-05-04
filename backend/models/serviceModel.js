import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  petType: { type: Array, required: true },
  description: { type: String },
  duration: { type: Number, required: true },  // duration in minutes
  price: { type: Number, required: true }
}, { _id: true });

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String },
  email: { type: String },
  phone: { type: String },
  category: { type: String, enum: ['grooming', 'vet'], required: true },
  description: { type: String },
  workingHours: {
    start: { type: String, required: true },  // e.g., "09:00"
    end: { type: String, required: true }     // e.g., "17:00"
  },
  packages: [packageSchema]
}, { timestamps: true });

export default mongoose.model('Service', serviceSchema);
