import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    qty: { type: Number, required: true, default: 1 }
});

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    cartItems: [cartItemSchema]
});

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;

