// // pages/admin/AdminOrderDetails.jsx
// import React from "react";
// import { useParams } from "react-router-dom";
// import { useGetOrderDetailsQuery } from "../../redux/api/orderApiSlice";

// const AdminOrderDetails = () => {
//   const { id } = useParams();
//   const { data: order, isLoading, error } = useGetOrderDetailsQuery(id);

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       <h2 className="text-xl font-bold mb-2">Order Details</h2>

//       {isLoading ? (
//         <p>Loading...</p>
//       ) : error ? (
//         <p className="text-red-500">{error?.data?.message || error.error}</p>
//       ) : (
//         <div className="space-y-2">
//           <p><strong>Order ID:</strong> {order._id}</p>
//           <p><strong>User:</strong> {order.user?.username}</p>
//           <p><strong>Total Price:</strong> ৳{order.totalPrice}</p>
//           <p><strong>Shipping Address:</strong> {order.shippingAddress?.address}</p>
//           <hr />
//           <h3 className="font-semibold mt-4">Items:</h3>
//           <ul className="list-disc ml-6">
//             {order.orderItems.map((item, idx) => (
//               <li key={idx}>
//                 {item.name} — Qty: {item.qty} — ৳{item.price}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminOrderDetails;
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useGetOrderDetailsQuery } from "../../redux/api/orderApiSlice";

const AdminOrderDetails = () => {
  const { id } = useParams();
  const { data: order, isLoading, error } = useGetOrderDetailsQuery(id);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded font-serif">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Admin - Order Details</h2>

      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error?.data?.message || error.error}</p>
      ) : (
        <>
          <div className="mb-6">
            <p><strong>Order ID:</strong> {order._id}</p>

            <p>
              <strong>User:</strong>{" "}
              {/* <Link
                to={`/admin/user/${order.user?._id}`}
                // to={`users/${order.user?._id}`}
                className="text-blue-600 hover:underline"
              > */}
              {order.user?.username}
              {/* </Link> */}
            </p>

            <p><strong>Email:</strong> {order.user?.email}</p>
            <p><strong>Total Price:</strong> ৳{order.totalPrice}</p>
            <p><strong>Shipping Address:</strong> {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}</p>
          </div>

          <h3 className="text-xl font-semibold text-green-600 mb-4">Ordered Items</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {order.orderItems.map((item, idx) => (
              <div key={idx} className="flex gap-4 border p-4 rounded-lg shadow-sm">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <p className="font-medium text-lg">{item.name}</p>
                  <p className="text-sm text-gray-600 mb-2">
                    Qty: {item.qty} × ৳{item.price}
                  </p>
                  <p className="text-green-700 font-bold mb-2">
                    ৳{(item.qty * item.price).toFixed(2)}
                  </p>
                  <Link
                    to={`/product/${item.product}`}
                    className="text-sm inline-block px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
                  >
                    View Product
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <Link
              to="/admin/orders"
              className="text-green-700 hover:underline font-semibold"
            >
              &larr; Back to Orders
            </Link>
          </div>
        </>
      )
      }
    </div >
  );
};

export default AdminOrderDetails;
