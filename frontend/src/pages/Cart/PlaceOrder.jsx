import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
// import ProgressSteps from "../../pages/Auth/components/";
import Loader from "../../components/Loader";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";
import moment from 'moment';
// import { toast } from "react-toastify";





const PlaceOrder = () => {
    const navigate = useNavigate();

    const cart = useSelector((state) => state.cart);
    console.log(cart)

    const [createOrder, { isLoading, error }] = useCreateOrderMutation();

    useEffect(() => {
        if (!cart.shippingAddress.address) {
            navigate("/shipping");
        }
    }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

    const dispatch = useDispatch();
    const pointsEarned = Math.floor(cart.totalPrice / 10);
    const deliveryFrom = moment().add(2, 'days').format('D MMMM YYYY'); // 4 March 2025
    const deliveryTo = moment().add(6, 'days').format('D MMMM YYYY');   // 10 March 2025

    const placeOrderHandler = async () => {
        try {
            const res = await createOrder({
                orderItems: cart.cartItems,
                shippingAddress: cart.shippingAddress,

            }).unwrap();
            console.log("Done")
            dispatch(clearCartItems());
            navigate("/cart")
            toast.success("Ordered Placed successfully");

        } catch (error) {
            console.log(error)
            toast.error(error.message);
        }
    };
    // const placeOrderHandler = async () => {
    //     try {
    //         const res = await createOrder({
    //             orderItems: cart.cartItems.map((item) => ({
    //                 name: item.name,
    //                 qty: item.qty,
    //                 image: item.image,
    //                 price: item.price,
    //                 product: item._id, // 👈 send _id as product reference
    //             })),
    //             shippingAddress: cart.shippingAddress,
    //         }).unwrap();
    //         console.log("Done")
    //         dispatch(clearCartItems());
    //         navigate("/cart")
    //         toast.success("Order Placed successfully");

    //     } catch (error) {
    //         console.log(error)
    //         toast.error(error.message);
    //     }
    // };


    return (
        <>
            {/* <ProgressSteps step1 step2 step3 /> */}
            <h1 className="text-5xl flex justify-center font-semibold mb-10 text-orange-900 ">Order Summary</h1>

            <div className="container mx-auto mt-8">
                {cart.cartItems.length === 0 ? (
                    <Message>Your cart is empty</Message>
                ) : (
                    <div className="overflow-x-auto">
                        <h3 className="text-2xl flex font-semibold mb-10">Ordered Items</h3>
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="font-semibold bg-slate-800 text-white">
                                    <td className="px-1 py-2 text-left align-top">#SL</td>
                                    <td className="px-1 py-2 text-left align-top">Image</td>
                                    <td className="px-1 py-2 text-left">Product</td>
                                    <td className="px-1 py-2 text-left">Quantity</td>
                                    <td className="px-1 py-2 text-left">Price</td>
                                    <td className="px-1 py-2 text-left">Total</td>
                                </tr>
                            </thead>

                            <tbody>
                                {cart.cartItems.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td className="p-2">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-16 h-16 object-cover"
                                            />
                                        </td>

                                        <td className="p-2">
                                            <Link to={`/product/${item.product}`}>{item.name}</Link>
                                        </td>
                                        <td className="p-2">{item.qty}</td>
                                        <td className="p-2">{item.price.toFixed(2)}</td>
                                        <td className="p-2">
                                            $ {(item.qty * item.price).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="mt-8">
                    {/* <h2 className="text-2xl font-semibold mb-5">Order Summary</h2> */}
                    <div className="flex justify-between flex-wrap p-8 bg-slate-200 text-slate-800 ">
                        <ul className="text-lg w-64">
                            <li>
                                <span className="font-semibold mb-4 pr-3">Cost:</span>
                                {cart.itemsPrice} BDT
                            </li>
                            <li>
                                <span className="font-semibold mb-4 pr-3">Shipping:</span>
                                {cart.shippingPrice} BDT
                            </li>
                            <li>
                                <span className="font-semibold mb-4 pr-3">Tax:</span>
                                {cart.taxPrice} BDT
                            </li>
                            <li>
                                <span className=" mb-4 pr-3">Total:</span>
                                {cart.totalPrice} BDT
                            </li>
                            <li>
                                <span className="font-semibold mb-4 pr-3">Earned Points:</span>
                                {pointsEarned}
                            </li>
                        </ul>

                        {error && <Message variant="danger">{error.data}</Message>}

                        <div className="">
                            <h2 className="text-2xl font-semibold mb-4">Shipping</h2>
                            <p className="w-64">
                                <strong>Address:</strong> {cart.shippingAddress.address},{" "}
                                {cart.shippingAddress.city} {cart.shippingAddress.postalCode},{" "}
                                {cart.shippingAddress.country}
                            </p>
                            <p className="text-md mt-4">
                                Expected Delivery: <span className="">{deliveryFrom}</span> – <span className="">{deliveryTo}</span>
                            </p>

                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold mb-4">Payment Method</h2>
                            {/* <strong>Method:</strong> {cart.paymentMethod} */}
                            Cash On Delivery
                        </div>
                    </div>
                    <div className="justify-items-center">
                        <button
                            type="button"
                            className="bg-slate-800 text-white py-2 px-4 w-64 flex justify-center justify-items-center text-lg w-full m-4"
                            disabled={cart.cartItems === 0}
                            onClick={placeOrderHandler}
                        >
                            Place Order
                        </button> </div>

                    {isLoading && <Loader />}
                </div>
            </div>
        </>
    );
};

export default PlaceOrder;