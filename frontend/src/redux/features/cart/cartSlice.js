// import { createSlice } from "@reduxjs/toolkit";
// import { updateCart } from "../../../pages/Cart/cartUtils";

// const initialState = localStorage.getItem("cart")
//     ? JSON.parse(localStorage.getItem("cart"))
//     : { cartItems: [], shippingAddress: {} };

// const cartSlice = createSlice({
//     name: "cart",
//     initialState,
//     reducers: {

//         addToCart: (state, action) => {
//             const { user, rating, numReviews, reviews, qty, ...item } = action.payload;
//             const existItem = state.cartItems.find((x) => x._id === item._id);
//             const validQty = Number(qty) || 1;

//             if (existItem) {
//                 // prevent duplicate
//                 state.cartItems = state.cartItems.map((x) =>
//                     x._id === item._id ? { ...x, qty: validQty } : x
//                 );
//             } else {
//                 //  qty = 1
//                 state.cartItems = [...state.cartItems, { ...item, qty: validQty }];
//             }

//             return updateCart(state, item);
//         },



//         removeFromCart: (state, action) => {
//             state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
//             return updateCart(state);
//         },

//         saveShippingAddress: (state, action) => {
//             // console.log(state.shippingAddress);
//             state.shippingAddress = action.payload;
//             localStorage.setItem("cart", JSON.stringify(state));
//         },


//         clearCartItems: (state, action) => {
//             state.cartItems = [];
//             localStorage.setItem("cart", JSON.stringify(state));
//         },

//         resetCart: (state) => (state = initialState),
//     },
// });

// export const {
//     // addToCart,
//     // removeFromCart,
//     // savePaymentMethod,
//     saveShippingAddress,
//     // clearCartItems,
//     // resetCart,
// } = cartSlice.actions;

// export default cartSlice.reducer;
// redux/features/cart/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    shippingAddress: localStorage.getItem("shippingAddress")
        ? JSON.parse(localStorage.getItem("shippingAddress"))
        : {},
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        saveShippingAddress: (state, action) => {
            state.shippingAddress = action.payload;
            localStorage.setItem("shippingAddress", JSON.stringify(action.payload));
        },
    },
});

export const { saveShippingAddress } = cartSlice.actions;
export default cartSlice.reducer;
