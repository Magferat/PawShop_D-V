// routes/orderRoutes 
import express from "express";
const router = express.Router();

import {
    createOrder,
    getAllOrders,
    getUserOrders,
    findOrderById,

} from "../controllers/orderController.js";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

router
    .route("/")
    .post(authenticate, createOrder)
    .get(authenticate, authorizeAdmin, getAllOrders);

router.route("/mine").get(authenticate, getUserOrders);

router.route("/:id").get(authenticate, findOrderById);

export default router;
