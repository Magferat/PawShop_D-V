
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useGetOrderDetailsQuery } from "../../redux/api/orderApiSlice";
import { addToCart } from "../../redux/features/Cart/cartSlice";
import Message from "../../components/Message";
import Loader from "../../components/Loader";

const Order = () => {
    const { id: orderId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { data: order, isLoading, error } = useGetOrderDetailsQuery(orderId);
    const { userInfo } = useSelector((state) => state.auth);

    const reorderHandler = () => {
        if (!order || !order.orderItems) return;

        order.orderItems.forEach((item) => {
            console.log(item)
            dispatch(
                addToCart({
                    _id: item.product,
                    name: item.name,
                    image: item.image,
                    price: item.price,
                    countInStock: item.countInStock || 10, // fallback if not present
                    qty: item.qty,
                })
            );
        });

        toast.success("Items re-added to cart!");
        navigate("/cart");
    };
    // const addToCartHandler = () => {
    //     dispatch(addToCart({ ...product, qty }));
    //     // navigate("/cart");
    //     // navigate("/productshop");
    //   };

    return isLoading ? (
        <Loader />
    ) : error ? (
        <Messsage variant="danger">{error.data.message}</Messsage>
    ) : (
        <div className="font-serif container flex flex-col ml-[10rem] md:flex-row">
            <div className="md:w-2/3 pr-4">
                <div className="mt-5 border-gray-300 pb-4 mb-4">
                    <h2 className="text-xl font-bold mb-2">Shipping</h2>
                    <p className="mb-4 mt-4">
                        <strong className="text-pink-500">Order:</strong> {order._id.slice(-5)}
                    </p>
                    <p className="mb-4">
                        <strong className="text-pink-500">Name:</strong> {order.user.username}
                    </p>
                    <p className="mb-4">
                        <strong className="text-pink-500">Email:</strong> {order.user.email}
                    </p>
                    <p className="mb-4">
                        <strong className="text-pink-500">Address:</strong>{" "}
                        {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
                        {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                    </p>
                    <p className="mb-4">
                        <strong className="text-pink-500">Method:</strong>{" "}
                        {order.paymentMethod}
                        <Messsage>Cash on Delivery - Not Paid</Messsage>
                    </p>
                </div>

                <div className="border gray-300 mt-5 pb-4 mb-5">
                    {order.orderItems.length === 0 ? (
                        <Messsage>Order is empty</Messsage>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-[80%]">
                                <thead className="border-b-2">
                                    <tr>
                                        <th className="p-2">Image</th>
                                        <th className="p-2">Product</th>
                                        <th className="p-2 text-center">Quantity</th>
                                        <th className="p-2">Unit Price</th>
                                        <th className="p-2">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.orderItems.map((item, index) => (
                                        <tr key={index}>
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
                                            <td className="p-2 text-center">{item.qty}</td>
                                            <td className="p-2 text-center">{item.price}</td>
                                            <td className="p-2 text-center">
                                                $ {(item.qty * item.price).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <button
                    type="button"
                    className="bg-green-500 text-white w-full py-2 mt-4"
                    onClick={reorderHandler}
                >
                    Reorder
                </button>
            </div>

            <div className="md:w-1/3 mt-[3rem]">
                <h2 className="text-xl font-bold mb-2">Order Summary</h2>
                <div className="flex justify-between mb-2">
                    <span>Items</span>
                    <span>$ {order.itemsPrice}</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span>Shipping</span>
                    <span>$ {order.shippingPrice}</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span>Tax</span>
                    <span>$ {order.taxPrice}</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span>Total</span>
                    <span>$ {order.totalPrice}</span>
                </div>
            </div>
        </div>
    );
};

export default Order;
