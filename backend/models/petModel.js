import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const petSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    species: { type: String, required: true },    // e.g., Dog, Cat, etc.
    breed: { type: String, required: true },    // e.g., Labrador, Persian, etc.
    age: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    size: { type: String, enum: ['Small', 'Medium', 'Large'], required: true },
    color: { type: String, required: true },
    status: { type: String, enum: ['For Sale', 'Adoptable', 'Foster'], required: true },
    price: { type: Number, required: function() { return this.status === 'For Sale'; } },
    duration: { type: String, required: function() { return this.status === 'Foster'; } },
    description: { type: String },
    vaccinated: { type: Boolean, default: false },
    neutered: { type: Boolean, default: false },
    image: { type: String, required: true},
    location: { type: String, required: true },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    }, 
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

  },
  { timestamps: true }
);

const Pet = mongoose.model("Pet", petSchema);
export default Pet;
