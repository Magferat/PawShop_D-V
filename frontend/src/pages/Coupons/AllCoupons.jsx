import React from "react";
import {
  useGetCouponsQuery,
  useDeleteCouponMutation,
} from "../../redux/api/couponApiSlice";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";

const AllCouponsAdmin = () => {
  const { data: coupons, isLoading, error, refetch } = useGetCouponsQuery();
  const [deleteCoupon, { isLoading: deleting }] = useDeleteCouponMutation();

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      try {
        await deleteCoupon(id).unwrap();
        toast.success("Coupon deleted");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || "Failed to delete");
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-gray text-3xl font-bold mb-6 text-center">All Coupons</h1>

      {isLoading ? (
        <p>Loading coupons...</p>
      ) : error ? (
        <p className="text-red-500">{error?.data?.message || "Error loading coupons"}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-md shadow-sm bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-black text-left p-3 border">Code</th>
                <th className="text-black text-left p-3 border">Discount (%)</th>
                <th className="text-black text-left p-3 border">Points</th>
                <th className="text-black text-left p-3 border">Description</th>
                <th className="text-black text-left p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon._id} className="text-black border-t hover:bg-gray-50">
                  <td className="text-black p-3">{coupon.templateCode}</td>
                  <td className="text-black p-3">{coupon.discountValue}</td>
                  <td className="text-black p-3">{coupon.pointCost}</td>
                  <td className="text-black p-3">{coupon.description}</td>
                  <td className="text-black p-3">
                    <button
                      onClick={() => handleDelete(coupon._id)}
                      disabled={deleting}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllCouponsAdmin;
