// // frontend/src/pages/Orders/OrderDetails.jsx

// import { useParams } from "react-router-dom";
// import { useGetOrderDetailsQuery } from "../../redux/api/orderApiSlice";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// // import { addToCart } from "../../redux/features/cartSlice"; // adjust path if needed
// import { addToCart } from "../../redux/features/cart/cartSlice";

// const OrderDetails = () => {
//     const { id: orderId } = useParams();
//     const { data: order, isLoading, error } = useGetOrderDetailsQuery(orderId);
//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     const handleReorder = () => {

//         order.orderItems.forEach((item) => {

//             const qty = item.qty;
//             dispatch(addToCart({ ...item, qty }));

//         });
//         navigate("/cart");
//     };



//     return (
//         <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
//             <h1 className="text-2xl font-bold mb-4 text-green-700">Order Details</h1>

//             {isLoading ? (
//                 <p>Loading...</p>
//             ) : error ? (
//                 <p className="text-red-500">Error: {error?.data?.message || error.message}</p>
//             ) : (
//                 <>
//                     <div>
//                         <div>
//                             <p className="mb-2 text-gray-700">
//                                 <strong>Order ID:</strong> {order._id}
//                             </p>
//                             <p className="mb-2 text-gray-700">
//                                 <strong>Order Date:</strong> {order.createdAt?.substring(0, 10)}
//                             </p>
//                             <p className="mb-4 text-gray-700">
//                                 <strong>Total Price:</strong> {order.totalPrice} BDT
//                             </p>

//                         </div>
//                         <div>
//                             <button
//                                 onClick={() => handleReorder()}
//                                 className="mt-6 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded shadow"
//                             >
//                                 Reorder
//                             </button>

//                         </div>
//                     </div>

//                     <h2 className="text-xl font-semibold text-green-600 mb-2">Ordered Items:</h2>
//                     <ul className="space-y-2">
//                         {order.orderItems.map((item, index) => (
//                             <li
//                                 key={index}
//                                 className="border p-4 rounded-lg flex justify-between items-center"
//                             >
//                                 <div>
//                                     <p className="font-medium">{item.name}</p>
//                                     <p className="text-sm text-gray-600">
//                                         Quantity: {item.qty} x {item.price} BDT
//                                     </p>
//                                 </div>
//                                 <p className="font-bold text-green-700">
//                                     {(item.qty * item.price).toFixed(2)} BDT
//                                 </p>
//                             </li>
//                         ))}
//                     </ul>
//                 </>
//             )}
//         </div>
//     );
// };

// export default OrderDetails;
import { useParams, Link, useNavigate } from "react-router-dom";
import { useGetOrderDetailsQuery } from "../../redux/api/orderApiSlice";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import jsPDF from "jspdf";
// import { Link } from "react-router-dom";
// import MyOrders from "./MyOrders";

const OrderDetails = () => {
    const { id: orderId } = useParams();
    const { data: order, isLoading, error } = useGetOrderDetailsQuery(orderId);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleReorder = () => {
        order.orderItems.forEach((item) => {
            const qty = item.qty;
            // dispatch(addToCart({ ...item, qty }));
            dispatch(addToCart({ ...item, qty, _id: item.product }));

        });
        navigate("/cart");
    };
    // const handleReorder = () => {
    //     order.orderItems.forEach((item) => {
    //         const qty = item.qty;
    //         // Use item.product as _id for the cart to work with backend later
    //         dispatch(addToCart({ ...item, qty, _id: item.product }));
    //     });
    //     navigate("/cart");
    // };

    // const handleDownloadInvoice = () => {
    //     const doc = new jsPDF();


    //     doc.setFontSize(18);
    //     doc.text("PawShop Invoice", 14, 22);
    //     doc.setFontSize(12);
    //     doc.text(`Order ID: ${order._id}`, 14, 30);
    //     doc.text(`Username: ${order.user.username}`, 14, 38);
    //     doc.text(`Email: ${order.user.email}`, 14, 46);
    //     doc.text(`Address: ${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`, 14, 54);

    //     let y = 70;
    //     order.orderItems.forEach((item, i) => {
    //         doc.text(`${i + 1}. ${item.name} - ${item.qty} x ${item.price} = ${item.qty * item.price} BDT`, 14, y);
    //         y += 10;
    //     });

    //     y += 10;
    //     doc.text(`Items Price: ${order.itemsPrice} BDT`, 14, y);
    //     doc.text(`Shipping: ${order.shippingPrice} BDT`, 14, y + 10);
    //     doc.text(`Tax: ${order.taxPrice} BDT`, 14, y + 20);
    //     doc.text(`Total: ${order.totalPrice} BDT`, 14, y + 30);

    //     doc.text(`Points Earned: ${order.pointsEarned}`, 14, y + 40);

    //     doc.save(`Invoice_${order._id}.pdf`);
    // };
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

        // Right Column: Pricing Info (align to ~ pageWidth - 80)
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
        <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-green-700">Order Details</h1>
                {/* <div className="flex justify-end mt-8"> */}
                <div className="">

                    <button
                        onClick={handleDownloadInvoice}
                        className=" px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded shadow mt-6"
                    >
                        Download Invoice
                    </button>
                    <button
                        onClick={handleReorder}
                        className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded shadow flex justify-end mt-8"
                    >
                        Reorder
                    </button>
                </div>



                {/* </div> */}


            </div>


            {isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="text-red-500">Error: {error?.data?.message || error.message}</p>
            ) : (
                <>
                    <div className="mb-6">
                        <p className="text-gray-700 overflow-hidden"><strong>Order ID: </strong> {order._id}</p>
                        {/* <p className="text-gray-700">
                        </p> */}
                        <p className=""> <strong>Order Date:</strong>
                            {new Date(order.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                            <br />
                            {new Date(order.createdAt).toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                            })}
                        </p>
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
                        <Link
                            to="/my-orders"
                            className="text-pink-700 font-semibold hover:underline mb-4 inline-block"
                        >
                            &larr; Go Back
                        </Link>                    </div>
                </>
            )}
        </div>
    );
};

export default OrderDetails;