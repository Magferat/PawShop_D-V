export const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state) => {
    // Calculate the items price
    state.itemsPrice = addDecimals(
        state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );

    // Calculate the shipping price
    // state.shippingPrice = addDecimals(
    //     state.cartItems.reduce((acc, item) => acc + item.price * item.qty > 100 ? 100 : 10, 100));

    state.shippingPrice = addDecimals(
        state.itemsPrice > 100 ? 100 : 10, 50);

    // itemsPrice > 100 ? 0 : 10);

    // Calculate the tax price
    state.taxPrice = addDecimals(Number((0.15 * state.itemsPrice).toFixed(2)));

    // Calculate the total price
    state.totalPrice = (
        Number(state.itemsPrice) +
        Number(state.shippingPrice) +
        Number(state.taxPrice)
    ).toFixed(2);
    state.pointsEarnd = Math.fround(state.totalPrice / 10)

    // Save the cart to localStorage
    localStorage.setItem("cart", JSON.stringify(state));

    return state;
};