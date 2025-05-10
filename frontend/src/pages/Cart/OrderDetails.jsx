
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useGetOrderDetailsQuery } from "../../redux/api/orderApiSlice";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import moment from 'moment';
import { useAddToCartMutation, } from "../../redux/features/cart/cartApiSlice";



const OrderDetails = () => {
    const { id: orderId } = useParams();
    const { data: order, isLoading, error } = useGetOrderDetailsQuery(orderId);
    const location = useLocation();
    const navigate = useNavigate();
    const isFromPlaceOrder = location.state?.fromPlaceOrder || false;

    const deliveryFrom = moment().add(2, 'days').format('D MMMM YYYY');
    const deliveryTo = moment().add(6, 'days').format('D MMMM YYYY');
    const [addToCart] = useAddToCartMutation();

    const handleReorder = async () => {
        try {

            for (const item of order.orderItems) {
                const qty = item.qty;

                const productId = item.product._id || item.product;

                const clampedQty = Math.max(1, Math.min(qty, item.product.countInStock || 100));

                await addToCart({
                    productId,
                    qty: clampedQty,
                });
            }

            // await refetch();
            navigate("/cart");

        } catch (error) {
            console.error("Reorder failed:", error);
            toast.error("Failed to reorder items.");
        }
    };


    const handleGoBack = () => {
        if (isFromPlaceOrder) {
            navigate("/");
        } else {
            navigate(-1);
        }
    };

    const handleDownloadInvoice = () => {
        const doc = new jsPDF();

        // Centered Title
        const title = "PawShop Invoice";
        const pageWidth = doc.internal.pageSize.getWidth();
        const textWidth = doc.getTextWidth(title);
        const xCenter = (pageWidth - textWidth) / 2;

        doc.setFontSize(22);
        doc.text(title, xCenter, 18);
        doc.setFontSize(10);

        // Left Column: Order Info
        doc.text(`Order ID: ${order._id}`, 14, 30);
        doc.text(`Username: ${order.user?.username || "N/A"}`, 14, 38);
        doc.text(`Email: ${order.user?.email || "N/A"}`, 14, 46);
        doc.text(
            `Address: ${order.shippingAddress?.address}, ${order.shippingAddress?.city}, ${order.shippingAddress?.postalCode}, ${order.shippingAddress?.country}`,
            14,
            54
        );

        const rightX = pageWidth - 80;
        doc.text(`Items Price: ${order.itemsPrice} BDT`, rightX, 30);
        doc.text(`Shipping: ${order.shippingPrice} BDT`, rightX, 38);
        doc.text(`Tax: ${order.taxPrice} BDT`, rightX, 46);
        doc.text(`Total: ${order.totalPrice} BDT`, rightX, 54);
        doc.text(`Points Earned: ${order.pointsEarned}`, rightX, 62);

        // Items List Title
        let y = 80;
        doc.setFontSize(14);
        doc.text("List of Items:", 14, y);
        doc.setFontSize(12);
        y += 10;

        // Items List
        order.orderItems.forEach((item, i) => {
            doc.text(
                `${i + 1}. ${item.name} - ${item.qty} x ${item.price} = ${item.qty * item.price} BDT`,
                14,
                y
            );
            y += 10;
        });

        // Thank You Message
        y += 10;
        doc.setFontSize(14);
        doc.text("Thank you for choosing PawShop <3", xCenter - 10, y);

        // Save PDF
        doc.save(`Invoice_${order._id}.pdf`);
    };


    return (

        <div className="font-serif max-w-5xl mx-auto p-6 bg-white shadow rounded 
            
            ">
            <div className="flex justify-between items-center mb-6 ">
                <h1 className="text-2xl font-bold text-green-700">Order Details</h1>
                <div className="">
                    <button
                        onClick={handleDownloadInvoice}
                        className=" px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded shadow mt-6"
                    >
                        Download Invoice
                    </button>

                    {!isFromPlaceOrder && (
                        <button
                            onClick={handleReorder}
                            className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded shadow flex justify-end mt-8"
                        >
                            Reorder
                        </button>
                    )}
                </div>

            </div>


            {isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="text-red-500">Error: {error?.data?.message || error.message}</p>
            ) : (
                <>
                    <div className="mb-6">
                        <p className="text-gray-700 overflow-hidden"><strong>Order ID: </strong> {order._id}</p>
                        <p className=""> <strong>Order Date:</strong>
                            {new Date(order.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                            <br />
                            <strong>Time : </strong> {new Date(order.createdAt).toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                            })}
                        </p>
                        {isFromPlaceOrder && (
                            <p className="text-md mt-4">
                                <strong> Expected Delivery: </strong><span className="">{deliveryFrom}</span> – <span className="">{deliveryTo}</span>
                            </p>

                        )}

                        <p><strong>Tax:</strong> {order.taxPrice} BDT</p>
                        <p><strong>Shipping Price:</strong> {order.shippingPrice} BDT</p>
                        <p><strong>Items Price:</strong> {order.itemsPrice} BDT</p>
                        <p><strong>Points Earned:</strong> {order.pointsEarned}</p>
                        <p><strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
                        <p className="text-black-700"><strong>Total Price:</strong> {order.totalPrice} BDT</p>

                    </div>

                    <h2 className="text-xl font-semibold text-green-600 mb-4">Ordered Items</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {order.orderItems.map((item, index) => (
                            <div key={index} className="flex gap-4 border p-4 rounded-lg shadow-sm">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-24 h-24 object-cover rounded"
                                />
                                <div className="flex-1">
                                    <p className="font-medium text-lg">{item.name}</p>
                                    <p className="text-sm text-gray-600 mb-2">
                                        {item.qty} x {item.price} BDT
                                    </p>
                                    <p className="text-green-700 font-bold mb-2">
                                        {(item.qty * item.price).toFixed(2)} BDT
                                    </p>
                                    <Link
                                        to={`/product/${item.product}`}
                                        className="inline-block text-sm px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div>


                        {!isFromPlaceOrder && (
                            <Link
                                onClick={handleGoBack}
                                className="text-green-700 font-semibold hover:underline mb-4 inline-block"
                            >
                                &larr; Go Back
                            </Link>

                        )}

                        {isFromPlaceOrder && (
                            <button
                            >
                                <Link
                                    to="/productshop"
                                    className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded shadow flex justify-end mt-8"
                                >
                                    &larr; Go To Shop
                                </Link>
                            </button>

                        )}


                    </div>
                </>
            )}
        </div>
    );
};

export default OrderDetails;
