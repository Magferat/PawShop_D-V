import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";
// export const getCart = async (req, res) => {
//     const cart = await Cart.findOne({ userId: req.user._id });
//     res.json(cart || { cartItems: [] });
// };
export const getCart = async (req, res) => {
    const cart = await Cart.findOne({ userId: req.user._id }).populate("cartItems.productId");

    if (!cart) {
        return res.json({ cartItems: [] });
    }

    // Format response to return embedded product info
    const populatedItems = cart.cartItems.map(item => ({
        product: item.productId,  // this now contains full product data
        qty: item.qty
    }));

    res.json({ cartItems: populatedItems });
};

export const addToCart = async (req, res) => {
    try {
        const { productId, qty } = req.body;

        if (!productId || !qty) {
            return res.status(400).json({ message: "Product ID and quantity are required" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        let cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) cart = new Cart({ userId: req.user._id, cartItems: [] });

        // Safely check for existing product in cart
        const existingItem = cart.cartItems.find(i => i?.productId?.toString() === productId.toString());

        // if (existingItem) {
        //     const newQty = existingItem.qty + qty;
        //     existingItem.qty = Math.min(newQty, product.countInStock);

        //     // existingItem.qty = qty; // or += qty based on your logic
        // } else {
        //     cart.cartItems.push({ productId, qty });
        // }
        if (existingItem) {
            const newQty = existingItem.qty + qty;

            if (newQty <= 0) {
                // Remove item if qty drops to 0 or below
                cart.cartItems = cart.cartItems.filter(i => i.productId.toString() !== productId.toString());
            } else {
                // Clamp between 1 and countInStock
                existingItem.qty = Math.min(newQty, product.countInStock);
            }
        } else {
            // Only add if qty > 0 and within stock
            if (qty > 0 && qty <= product.countInStock) {
                cart.cartItems.push({ productId, qty });
            } else {
                return res.status(400).json({ message: "Invalid quantity" });
            }
        }


        await cart.save();
        res.json(cart);

    } catch (error) {
        console.error("Error in addToCart:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const updateQuantity = async (req, res) => {
    const { qty } = req.body;
    const cart = await Cart.findOne({ userId: req.user._id });

    const item = cart.cartItems.find(i => i.productId.equals(req.params.productId));
    if (item) item.qty = qty;

    await cart.save();
    res.json(cart);
};

export const removeFromCart = async (req, res) => {
    const cart = await Cart.findOne({ userId: req.user._id });

    cart.cartItems = cart.cartItems.filter(i => !i.productId.equals(req.params.productId));

    await cart.save();
    res.json(cart);
};

export const clearCart = async (req, res) => {
    await Cart.findOneAndDelete({ userId: req.user._id });
    res.json({ message: "Cart cleared" });
};
