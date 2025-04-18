import mongoose from "mongoose";

const requestSchema = mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  pet: { type: mongoose.Schema.Types.ObjectId, ref: "Pet", required: true },
  type: { type: String, enum: ['For Sale', 'Adoptable', 'Foster'], required: true },
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
}, { timestamps: true });

const PetRequest = mongoose.model("PetRequest", requestSchema);

export default PetRequest;
