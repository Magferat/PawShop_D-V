
import { useGetAllOrdersQuery } from "../../redux/features/cart/orderApiSlice";
import { Link } from "react-router-dom";

const AdminOrderList = () => {
  const { data: orders, isLoading, error } = useGetAllOrdersQuery();

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">All Orders</h1>

      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error?.data?.message || error.error}</p>
      ) : (
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Order ID</th>
              <th className="p-2 border">User</th>
              <th className="p-2 border">Total {"(BDT)"}</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="p-2 border">{order._id}</td>
                <td className="p-2 border">{order.user?.username || "N/A"}</td>
                <td className="p-2 border">{order.totalPrice} </td>
                <td className="p-2 border">{order.createdAt.substring(0, 10)}</td>
                <td className="p-2 border">
                  <Link
                    to={`/admin/order/${order._id}`}
                    className="text-blue-500 hover:underline"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminOrderList;
