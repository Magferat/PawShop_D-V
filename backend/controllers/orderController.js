// controllers/orderControlers

import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";

// Utility Function
function calcPrices(orderItems) {
    const itemsPrice = orderItems.reduce(
        (acc, item) => acc + item.price * item.qty,
        0
    );

    const shippingPrice = itemsPrice > 100 ? 100 : 10;
    const taxRate = 0.15;
    const taxPrice = (itemsPrice * taxRate).toFixed(2);
    const totalPrice = (
        itemsPrice +
        shippingPrice +
        parseFloat(taxPrice)
    ).toFixed(2);


    return {
        itemsPrice: itemsPrice.toFixed(2),
        shippingPrice: shippingPrice.toFixed(2),
        taxPrice,
        totalPrice,
    };
}

const createOrder = async (req, res) => {
    try {
        const { orderItems, shippingAddress } = req.body;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: "No order items" });
        }

        // Extract product IDs correctly
        const productIds = orderItems.map((item) =>
            item.product._id ? item.product._id : item.product
        );

        // Fetch full product details from DB
        const itemsFromDB = await Product.find({ _id: { $in: productIds } });

        // Construct order items with validated price from DB
        const dbOrderItems = orderItems.map((clientItem) => {
            const productId = clientItem.product._id || clientItem.product;

            const matchingItem = itemsFromDB.find(
                (dbItem) => dbItem._id.toString() === productId.toString()
            );

            if (!matchingItem) {
                throw new Error(`Product not found: ${productId}`);
            }

            return {
                name: matchingItem.name,
                image: matchingItem.image,
                price: matchingItem.price,
                product: matchingItem._id,
                qty: clientItem.qty,
            };
        });

        // Calculate prices
        const itemsPrice = dbOrderItems.reduce((acc, item) => acc + item.qty * item.price, 0);
        const shippingPrice = itemsPrice > 1000 ? 0 : 100;
        const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
        const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));
        const pointsEarned = Math.floor(totalPrice / 10);

        // Create order document
        const order = new Order({
            orderItems: dbOrderItems,
            user: req.user._id,
            shippingAddress,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            pointsEarned,
        });

        const createdOrder = await order.save();

        // Update user points
        const user = await User.findById(req.user._id);
        user.points += pointsEarned;
        await user.save();

        // Decrease product stock
        for (const item of dbOrderItems) {
            const product = await Product.findById(item.product);

            if (product) {
                product.countInStock = Math.max(0, product.countInStock - item.qty);
                await product.save();
            }
        }


        res.status(201).json({ order: createdOrder, newPoints: user.points });



    } catch (error) {
        console.error("❌ Error in createOrder:", error.message);
        res.status(500).json({ message: error.message });
    }
};

const findOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate(
            "user",
            "username email"
        );

        if (order) {
            res.json(order);
        } else {
            res.status(404);
            throw new Error("Order not found");
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate("user", "id username");
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUserOrders = async (req, res) => {
    try {

        const orders = await Order.find({ user: req.user._id }).populate('user', 'username email');

        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const countTotalOrders = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        res.json({ totalOrders });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const calculateTotalSales = async (req, res) => {
    try {
        const orders = await Order.find();
        const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);
        res.json({ totalSales });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const calcualteTotalSalesByDate = async (req, res) => {
    try {
        const salesByDate = await Order.aggregate([
            {
                $match: {
                    isPaid: true,
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$paidAt" },
                    },
                    totalSales: { $sum: "$totalPrice" },
                },
            },
        ]);

        res.json(salesByDate);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export {
    createOrder,
    getAllOrders,
    getUserOrders,
    countTotalOrders,
    calculateTotalSales,
    calcualteTotalSalesByDate,
    findOrderById,
    // markOrderAsPaid,
    // markOrderAsDelivered,
};
