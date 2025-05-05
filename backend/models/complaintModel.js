import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    complaintAgainst: {
      type: String,
      enum: ['product', 'user'],
      required: true
    },
    orderId: String,
    email: String,
    typeOfComplaint: {
      type: String,
      required: true
    },
    dateOfIncident: {
      type: Date,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  });
  
  complaintSchema.pre('validate', function (next) {
    if (this.complaintAgainst === 'product' && !this.orderId) {
      this.invalidate('orderId', 'Order ID is required for product complaints.');
    }
    if (this.complaintAgainst === 'user' && !this.email) {
      this.invalidate('username', 'Email is required for user complaints.');
    }
    next();
  });

  const Complaint = mongoose.model('Complaint', complaintSchema);
  export default Complaint;
  