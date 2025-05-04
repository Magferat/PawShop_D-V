// import { useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { useDispatch, useSelector } from "react-redux";
// import Message from "../../pages/Auth/components/Message";
// // import ProgressSteps from "../../pages/Auth/components/";
// import Loader from "../../pages/Auth/components/Loader";
// import { useCreateOrderMutation } from "../../redux/features/cart/orderApiSlice";
// import { clearCartItems } from "../../redux/features/cart/cartSlice";
// import { useClearCartMutation } from "../../redux/features/cart/cartApiSlice";

// import moment from 'moment';
// // import { toast } from "react-toastify";





// const PlaceOrder = () => {
//     const navigate = useNavigate();
//     const [clearCart] = useClearCartMutation();

//     const cart = useSelector((state) => state.cart);
//     console.log(cart)

//     const [createOrder, { isLoading, error }] = useCreateOrderMutation();

//     useEffect(() => {
//         if (!cart.shippingAddress.address) {
//             navigate("/shipping");
//         }
//     }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

//     const dispatch = useDispatch();
//     const pointsEarned = Math.floor(cart.totalPrice / 10);
//     const deliveryFrom = moment().add(2, 'days').format('D MMMM YYYY');
//     const deliveryTo = moment().add(6, 'days').format('D MMMM YYYY');

//     // const placeOrderHandler = async () => {
//     //     try {
//     //         const res = await createOrder({
//     //             orderItems: cart.cartItems,
//     //             shippingAddress: cart.shippingAddress,

//     //         }).unwrap();
//     //         console.log(res.order._id);
//     //         dispatch(clearCartItems());
//     //         // navigate("/cart")
//     //         // navigate(`/orders/${res.order._id}`);
//     //         navigate(`/orders/${res.order._id}`, { state: { fromPlaceOrder: true } });


//     //         // navigate("/order-details")
//     //         toast.success("Ordered Placed successfully");

//     //     } catch (error) {
//     //         console.log(error)
//     //         toast.error(error.message);
//     //     }
//     // };
//     const placeOrderHandler = async () => {
//         try {
//             const res = await createOrder({
//                 orderItems: cart.cartItems,
//                 shippingAddress: cart.shippingAddress,
//             }).unwrap();

//             await clearCart(); // 🧹 clear user's cart from DB

//             navigate(`/orders/${res.order._id}`, { state: { fromPlaceOrder: true } });
//             toast.success("Order placed successfully");
//         } catch (error) {
//             toast.error(error.message);
//         }
//     };



//     return (
//         <>
//             {/* <ProgressSteps step1 step2 step3 /> */}
//             <h1 className="text-5xl flex justify-center font-semibold mb-10 text-orange-900 ">Order Summary</h1>

//             <div className="container mx-auto mt-8">
//                 {cart.cartItems.length === 0 ? (
//                     <Message>Your cart is empty</Message>
//                 ) : (
//                     <div className="overflow-x-auto">
//                         <h3 className="text-2xl flex font-semibold mb-10">Ordered Items</h3>
//                         <table className="w-full border-collapse">
//                             <thead>
//                                 <tr className="font-semibold bg-slate-800 text-white">
//                                     <td className="px-1 py-2 text-left align-top">#SL</td>
//                                     <td className="px-1 py-2 text-left align-top">Image</td>
//                                     <td className="px-1 py-2 text-left">Product</td>
//                                     <td className="px-1 py-2 text-left">Quantity</td>
//                                     <td className="px-1 py-2 text-left">Price</td>
//                                     <td className="px-1 py-2 text-left">Total</td>
//                                 </tr>
//                             </thead>

//                             <tbody>
//                                 {cart.cartItems.map((item, index) => (
//                                     <tr key={index}>
//                                         <td>{index + 1}</td>
//                                         <td className="p-2">
//                                             <img
//                                                 src={item.image}
//                                                 alt={item.name}
//                                                 className="w-16 h-16 object-cover"
//                                             />
//                                         </td>

//                                         <td className="p-2">
//                                             <Link to={`/product/${item.product}`}>{item.name}</Link>
//                                         </td>
//                                         <td className="p-2">{item.qty}</td>
//                                         <td className="p-2">{item.price.toFixed(2)}</td>
//                                         <td className="p-2">
//                                             $ {(item.qty * item.price).toFixed(2)}
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 )}

//                 <div className="mt-8">
//                     {/* <h2 className="text-2xl font-semibold mb-5">Order Summary</h2> */}
//                     <div className="flex justify-between flex-wrap p-8 bg-slate-200 text-slate-800 ">
//                         <ul className="text-lg w-64">
//                             <li>
//                                 <span className="font-semibold mb-4 pr-3">Cost:</span>
//                                 {cart.itemsPrice} BDT
//                             </li>
//                             <li>
//                                 <span className="font-semibold mb-4 pr-3">Shipping:</span>
//                                 {cart.shippingPrice} BDT
//                             </li>
//                             <li>
//                                 <span className="font-semibold mb-4 pr-3">Tax:</span>
//                                 {cart.taxPrice} BDT
//                             </li>
//                             <li>
//                                 <span className=" mb-4 pr-3">Total:</span>
//                                 {cart.totalPrice} BDT
//                             </li>
//                             <li>
//                                 <span className="font-semibold mb-4 pr-3">Earned Points:</span>
//                                 {pointsEarned}
//                             </li>
//                         </ul>

//                         {error && <Message variant="danger">{error.data}</Message>}

//                         <div className="">
//                             <h2 className="text-2xl font-semibold mb-4">Shipping</h2>
//                             <p className="w-64">
//                                 <strong>Address:</strong> {cart.shippingAddress.address},{" "}
//                                 {cart.shippingAddress.city} {cart.shippingAddress.postalCode},{" "}
//                                 {cart.shippingAddress.country}
//                             </p>
//                             <p className="text-md mt-4">
//                                 Expected Delivery: <span className="">{deliveryFrom}</span> – <span className="">{deliveryTo}</span>
//                             </p>

//                         </div>

//                         <div>
//                             <h2 className="text-2xl font-semibold mb-4">Payment Method</h2>
//                             {/* <strong>Method:</strong> {cart.paymentMethod} */}
//                             Cash On Delivery
//                         </div>
//                     </div>
//                     <div className="justify-items-center">
//                         <button
//                             type="button"
//                             className="bg-slate-800 text-white py-2 px-4 w-64 flex justify-center justify-items-center text-lg w-full m-4"
//                             disabled={cart.cartItems === 0}
//                             onClick={placeOrderHandler}
//                         >
//                             Place Order
//                         </button> </div>

//                     {isLoading && <Loader />}
//                 </div>
//             </div>
//         </>
//     );
// };

// export default PlaceOrder;
// import { useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { useCreateOrderMutation } from "../../redux/features/cart/orderApiSlice";
// import { useClearCartMutation, useGetCartQuery } from "../../redux/features/cart/cartApiSlice";
// import { saveShippingAddress } from "../../redux/features/cart/cartSlice";

// import Loader from "../../pages/Auth/components/Loader";
// import Message from "../../pages/Auth/components/Message";
// import moment from "moment";

// const PlaceOrder = () => {
//     const navigate = useNavigate();
//     const [clearCart] = useClearCartMutation();
//     const [createOrder, { isLoading, error }] = useCreateOrderMutation();
//     const cart = useSelector((state) => state.cart); //local Redux cart


//     const {
//         data: cartData,
//         isLoading: loadingCart,
//         isError,
//     } = useGetCartQuery();
//     // console.log(cart);

//     useEffect(() => {
//         if (!loadingCart && !cart?.shippingAddress?.address) {
//             navigate("/shipping");
//         }
//     }, [loadingCart, cart, navigate]);

//     if (loadingCart) return <Loader />;
//     if (isError || !cart) return <Message variant="danger">Failed to load cart data</Message>;

//     const pointsEarned = Math.floor(cartData.totalPrice / 10);
//     const deliveryFrom = moment().add(2, "days").format("D MMMM YYYY");
//     const deliveryTo = moment().add(6, "days").format("D MMMM YYYY");

//     const placeOrderHandler = async () => {
//         try {
//             const res = await createOrder({
//                 orderItems: cartData.cartItems,
//                 shippingAddress: cart.shippingAddress,
//             }).unwrap();

//             await clearCart(); // 🧹 clear user's cart from DB

//             navigate(`/orders/${res.order._id}`, { state: { fromPlaceOrder: true } });
//             toast.success("Order placed successfully");
//         } catch (error) {
//             toast.error(error.message || "Failed to place order");
//         }
//     };

//     return (
//         <>
//             <h1 className="text-5xl flex justify-center font-semibold mb-10 text-orange-900">
//                 Order Summary
//             </h1>

//             <div className="container mx-auto mt-8">
//                 {cartData.cartItems.length === 0 ? (
//                     <Message>Your cart is empty</Message>
//                 ) : (
//                     <div className="overflow-x-auto">
//                         <h3 className="text-2xl flex font-semibold mb-10">Ordered Items</h3>
//                         <table className="w-full border-collapse">
//                             <thead>
//                                 <tr className="font-semibold bg-slate-800 text-white">
//                                     <td className="px-1 py-2 text-left align-top">#SL</td>
//                                     <td className="px-1 py-2 text-left align-top">Image</td>
//                                     <td className="px-1 py-2 text-left">Product</td>
//                                     <td className="px-1 py-2 text-left">Quantity</td>
//                                     <td className="px-1 py-2 text-left">Price</td>
//                                     <td className="px-1 py-2 text-left">Total</td>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {cart.cartItems.map((item, index) => (
//                                     <tr key={index}>
//                                         <td>{index + 1}</td>
//                                         {console.log("here", item.product)}
//                                         <td className="p-2">
//                                             <img
//                                                 src={item.product.image}
//                                                 alt={item.product.name}
//                                                 className="w-16 h-16 object-cover"
//                                             />
//                                         </td>
//                                         <td className="p-2">
//                                             <Link to={`/product/${item.product.product}`}>{item.product.name}</Link>
//                                         </td>
//                                         <td className="p-2">{item.product.qty}</td>
//                                         <td className="p-2">{item.product.price.toFixed(2)}</td>
//                                         <td className="p-2">${(item.product.qty * item.price).toFixed(2)}</td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 )}

//                 <div className="mt-8">
//                     <div className="flex justify-between flex-wrap p-8 bg-slate-200 text-slate-800">
//                         <ul className="text-lg w-64">
//                             <li>
//                                 <span className="font-semibold mb-4 pr-3">Cost:</span>
//                                 {cart.itemsPrice} BDT
//                             </li>
//                             <li>
//                                 <span className="font-semibold mb-4 pr-3">Shipping:</span>
//                                 {cart.shippingPrice} BDT
//                             </li>
//                             <li>
//                                 <span className="font-semibold mb-4 pr-3">Tax:</span>
//                                 {cart.taxPrice} BDT
//                             </li>
//                             <li>
//                                 <span className="mb-4 pr-3">Total:</span>
//                                 {cart.totalPrice} BDT
//                             </li>
//                             <li>
//                                 <span className="font-semibold mb-4 pr-3">Earned Points:</span>
//                                 {pointsEarned}
//                             </li>
//                         </ul>

//                         {error && <Message variant="danger">{error.data || error.message}</Message>}

//                         <div>
//                             <h2 className="text-2xl font-semibold mb-4">Shipping</h2>
//                             <p className="w-64">
//                                 <strong>Address:</strong> {cart.shippingAddress.address},{" "}
//                                 {cart.shippingAddress.city} {cart.shippingAddress.postalCode},{" "}
//                                 {cart.shippingAddress.country}
//                             </p>
//                             <p className="text-md mt-4">
//                                 Expected Delivery: <span>{deliveryFrom}</span> – <span>{deliveryTo}</span>
//                             </p>
//                         </div>

//                         <div>
//                             <h2 className="text-2xl font-semibold mb-4">Payment Method</h2>
//                             Cash On Delivery
//                         </div>
//                     </div>

//                     <div className="justify-items-center">
//                         <button
//                             type="button"
//                             className="bg-slate-800 text-white py-2 px-4 w-64 flex justify-center justify-items-center text-lg w-full m-4"
//                             disabled={cart.cartItems.length === 0}
//                             onClick={placeOrderHandler}
//                         >
//                             Place Order
//                         </button>
//                     </div>

//                     {isLoading && <Loader />}
//                 </div>
//             </div>
//         </>
//     );
// };

// export default PlaceOrder;
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useCreateOrderMutation } from "../../redux/features/cart/orderApiSlice";
import { useClearCartMutation, useGetCartQuery } from "../../redux/features/cart/cartApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import moment from "moment";

const PlaceOrder = () => {
    const navigate = useNavigate();

    // Load shipping address from Redux state (localStorage initialized here)


    const shippingAddress = useSelector((state) =>
        state.cart.shippingAddress);
    // console.log("here", shippingAddress);


    // Load cart items from DB
    const {
        data: cartData,
        isLoading: loadingCart,
        isError,
    } = useGetCartQuery();
    // console.log("cartData.cartItems:", cartData.cartItems);


    const [clearCart] = useClearCartMutation();
    const [createOrder, { isLoading: placingOrder, error }] = useCreateOrderMutation();

    // Redirect to shipping if address is missing
    useEffect(() => {
        if (!loadingCart && (!shippingAddress || !shippingAddress.address)) {
            navigate("/shipping");
        }
    }, [loadingCart, shippingAddress, navigate]);

    if (loadingCart) return <Loader />;
    if (isError || !cartData) return <Message variant="danger">Failed to load cart data</Message>;

    const cartItems = cartData?.cartItems || [];

    const itemsPrice = cartItems.reduce((acc, item) => {
        const qty = Number(item.qty) || 0;
        const price = Number(item.product?.price) || 0;
        return acc + qty * price;
    }, 0);

    const shippingPrice = itemsPrice > 500 ? 150 : 70;
    const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
    const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));
    const pointsEarned = Math.floor(totalPrice / 10);

    // console.log({ itemsPrice, shippingPrice, taxPrice, totalPrice, pointsEarned });

    const deliveryFrom = moment().add(2, "days").format("D MMMM YYYY");
    const deliveryTo = moment().add(6, "days").format("D MMMM YYYY");

    const placeOrderHandler = async () => {
        try {
            const res = await createOrder({
                orderItems: cartData.cartItems,
                shippingAddress,
            }).unwrap();
            // console.log(res)
            await clearCart();
            navigate(`/orders/${res.order._id}`, { state: { fromPlaceOrder: true } });
            toast.success("Order placed successfully");
        } catch (error) {
            toast.error(error?.data?.message || "Failed to place order");
        }
    };

    return (
        <>
            <h1 className="font-serif text-5xl flex justify-center font-semibold mb-10 text-orange-900">Order Summary</h1>

            <div className="font-serif container mx-auto mt-8">
                {cartData.cartItems.length === 0 ? (
                    <Message>Your cart is empty</Message>
                ) : (
                    <div className="overflow-x-auto">
                        <h3 className="text-2xl flex font-semibold mb-10">Ordered Items</h3>
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="font-semibold bg-slate-800 text-white">
                                    <td className="px-1 py-2">#SL</td>
                                    <td className="px-1 py-2">Image</td>
                                    <td className="px-1 py-2">Product</td>
                                    <td className="px-1 py-2">Qty</td>
                                    <td className="px-1 py-2">Price</td>
                                    <td className="px-1 py-2">Total</td>
                                </tr>
                            </thead>
                            <tbody>
                                {cartData.cartItems.map((item, index) => {
                                    const price = item.price ?? item.product?.price ?? 0;
                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td className="p-2">
                                                <img
                                                    src={item.product?.image}
                                                    alt={item.product?.name}
                                                    className="w-16 h-16 object-cover"
                                                />
                                            </td>
                                            <td className="p-2">
                                                <Link to={`/product/${item.product?._id}`}>{item.product?.name}</Link>
                                            </td>
                                            <td className="p-2">{item.qty}</td>
                                            <td className="p-2">{price.toFixed(2)}</td>
                                            <td className="p-2">{(item.qty * price).toFixed(2)} BDT</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="mt-8">
                    <div className="flex justify-between flex-wrap p-8 bg-slate-200 text-slate-800">
                        <ul className="text-lg w-64">
                            <li><strong>Cost:</strong> {itemsPrice.toFixed(2)} BDT</li>
                            <li><strong>Shipping:</strong> {shippingPrice} BDT</li>
                            <li><strong>Tax:</strong> {taxPrice} BDT</li>
                            <li><strong>Total:</strong> {totalPrice} BDT</li>
                            <li><strong>Earned Points:</strong> {pointsEarned}</li>
                        </ul>

                        {error && <Message variant="danger">{error?.data || error.message}</Message>}

                        <div className="w-64">
                            <h2 className="text-2xl font-semibold mb-4">Shipping</h2>
                            <p>
                                <strong>Address:</strong>{" "}
                                {shippingAddress?.address}, {shippingAddress?.city},{" "}
                                {shippingAddress?.postalCode}, {shippingAddress?.country}
                            </p>
                            <p className="text-md mt-4">
                                Expected Delivery: <span>{deliveryFrom}</span> – <span>{deliveryTo}</span>
                            </p>
                        </div>

                        <div className="w-64">
                            <h2 className="text-2xl font-semibold mb-4">Payment Method</h2>
                            Cash On Delivery
                        </div>
                    </div>

                    <div className="justify-items-center">
                        <button
                            type="button"
                            className="bg-slate-800 text-white py-2 px-4 w-64 flex justify-center text-lg m-4"
                            disabled={cartData.cartItems.length === 0}
                            onClick={placeOrderHandler}
                        >
                            Place Order
                        </button>
                    </div>

                    {placingOrder && <Loader />}
                </div>
            </div>
        </>
    );
};

export default PlaceOrder;
