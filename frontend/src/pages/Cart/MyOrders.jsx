// import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";

// import { Link } from "react-router-dom";


// const MyOrders = () => {
//     const { data: orders, isLoading, error } = useGetMyOrdersQuery();

//     return (
//         <div className="max-w-5xl mx-auto mt-8 p-6 bg-white shadow-xl rounded-lg">
//             <h1 className="text-3xl font-bold text-green-800 mb-6">My Orders</h1>

//             {isLoading ? (
//                 <p>Loading orders...</p>
//             ) : error ? (
//                 <p className="text-red-600">Error: {error?.data?.message || error.message}</p>
//             ) : orders.length === 0 ? (
//                 <p>No orders found.</p>
//             ) : (
//                 <div className="overflow-x-auto">
//                     <table className="min-w-full border border-gray-200 text-left">
//                         <thead className="bg-green-100 text-green-900">
//                             <tr>
//                                 <th className="py-2 px-4">ID</th>
//                                 <th className="py-2 px-4">Date</th>
//                                 <th className="py-2 px-4">Total</th>

//                                 <th className="py-2 px-4">Details</th>
//                             </tr>
//                         </thead>

//                         <tbody>
//                             {orders.map((order) => (
//                                 <tr key={order._id} className="border-t text-center text-green-700">
//                                     <td className="py-2 px-4 text-sm break-all">{order._id ? `${order._id.slice(-5)}` : "N/A"}</td>
//                                     <td className="py-2 px-4 text-sm">
//                                         {order.createdAt ? order.createdAt.substring(0, 10) : "N/A"}
//                                     </td>
//                                     <td className="py-2 px-4 text-green-700 text-sm">
//                                         {order.totalPrice ? `${order.totalPrice} BDT` : "0 BDT"}
//                                     </td>

//                                     <td className="py-2 px-4 text-sm">
//                                         <Link to={`/orders/${order._id}`} className="text-blue-600 hover:underline">
//                                             View
//                                         </Link>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>

//                     </table>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default MyOrders;
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";

const MyOrders = () => {
    const { data: orders, isLoading, error } = useGetMyOrdersQuery();

    // const handleDownloadInvoice = (order) => {
    //     const doc = new jsPDF();

    //     doc.setFontSize(20);
    //     doc.text("PawShop Invoice", 50, 22);
    //     doc.setFontSize(12);

    //     doc.text(`Order ID: ${order._id}`, 14, 30);
    //     doc.text(`Username: ${order.user?.username || "N/A"}`, 14, 38);
    //     doc.text(`Email: ${order.user?.email || "N/A"}`, 14, 46);
    //     doc.text(
    //         `Address: ${order.shippingAddress?.address}, ${order.shippingAddress?.city}, ${order.shippingAddress?.postalCode}, ${order.shippingAddress?.country}`,
    //         14,
    //         54
    //     );

    //     let y = 70;
    //     order.orderItems.forEach((item, i) => {
    //         doc.text(
    //             `${i + 1}. ${item.name} - ${item.qty} x ${item.price} = ${item.qty * item.price} BDT`,
    //             14,
    //             y
    //         );
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
    const handleDownloadInvoice = (order) => {
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
        <div className="font-serif max-w-4xl mx-auto mt-8 p-4">
            <h1 className="text-4xl font-extrabold text-center mb-8 text-orange-800 shadow-sm">
                Purchase History
            </h1>

            {isLoading ? (
                <p className="text-center">Loading orders...</p>
            ) : error ? (
                <p className="text-red-600 text-center">
                    Error: {error?.data?.message || error.message}
                </p>
            ) : orders.length === 0 ? (
                <p className="text-center">No orders found.</p>
            ) : (
                <div className="space-y-6">
                    {[...orders]
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .map((order) => (

                            <div key={order._id} className="rounded-xl border shadow-md overflow-hidden">
                                <div className="bg-gradient-to-r from-orange-100 to-orange-200 px-6 py-4 flex justify-between items-center">
                                    <div>
                                        <p className="text-xs text-gray-600">ORDER PLACED</p>
                                        {/* <p className="font-semibold text-sm">
                                            
                                            {new Date(order.createdAt).toLocaleString()}

                                        </p> */}
                                        <p className="font-semibold text-sm">
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

                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">Total</p>
                                        <p className="font-semibold text-sm">BDT {order.totalPrice.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">Order ID</p>
                                        <p className="font-semibold text-sm">{order._id.slice(-6)}</p>
                                    </div>
                                    <Link
                                        to={`/orders/${order._id}`}
                                        state={{ fromPlaceOrder: false }}
                                        className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-1 rounded"
                                    >
                                        View Details
                                    </Link>
                                    {/* <Link
                                        to={`/orders/${order._id}`}
                                        className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-1 rounded"
                                    >
                                        Order Details
                                    </Link> */}
                                </div>

                                <div className="bg-orange-300 px-6 py-4 flex justify-between items-center text-white font-semibold text-sm">
                                    <div className="flex items-center space-x-4">
                                        <img
                                            src={order.orderItems[0]?.image}
                                            alt="Product"
                                            className="w-14 h-14 object-cover rounded shadow"
                                        />
                                        <span>
                                            {order.orderItems[0]?.name}
                                            {order.orderItems.length > 1 && (
                                                <span className="ml-2">and {order.orderItems.length - 1} more item(s)</span>
                                            )}
                                        </span>
                                    </div>

                                    <div className="flex space-x-2">
                                        {/* <button className="bg-orange-600 hover:bg-orange-700 px-3 py-1 rounded text-sm">
                                            Reorder
                                        </button> */}
                                        {/* <button className="bg-orange-600 hover:bg-orange-700 px-3 py-1 rounded text-sm">
                                            Invoice
                                        </button> */}
                                        <button
                                            onClick={() => handleDownloadInvoice(order)}
                                            className="bg-orange-600 hover:bg-orange-700 px-3 py-1 rounded text-sm"
                                        >
                                            Download Invoice
                                        </button>

                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;
