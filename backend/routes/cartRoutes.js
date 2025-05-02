import express from "express";
import {
  addToCart,
  getCart,
  updateQuantity,
  removeFromCart,
  clearCart
} from "../controllers/cartController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();
console.log("at routes");

router.route("/").get(authenticate, getCart).post(authenticate, addToCart);
router.route("/update/:productId").put(authenticate, updateQuantity);
router.route("/remove/:productId").delete(authenticate, removeFromCart);
router.route("/clear").delete(authenticate, clearCart);

export default router;
