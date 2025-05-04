import React from "react";
import {
  useGetCouponsQuery,
  useAssignCouponMutation,
  useGetUserCouponsQuery,
} from "../../redux/api/couponApiSlice";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const ShopCoupons = () => {
  const { data: coupons, isLoading, error } = useGetCouponsQuery();
  const [assignCoupon, { isLoading: assigning }] = useAssignCouponMutation();
  const { refetch: refetchUserCoupons } = useGetUserCouponsQuery(); // <-- for live updates

  const { userInfo } = useSelector((state) => state.auth);

  const handleRedeem = async (couponId) => {
    try {
      await assignCoupon(couponId).unwrap();
      toast.success("Coupon redeemed successfully!");
      refetchUserCoupons(); // <-- Refresh user coupons
    } catch (err) {
      toast.error(err?.data?.message || "Could not redeem coupon");
    }
  };

  const isUser = userInfo && !userInfo.isAdmin;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center text-pink-700">
        Available Coupons
      </h1>

      {isLoading ? (
        <p className="text-center text-gray-600">Loading coupons...</p>
      ) : error ? (
        <p className="text-center text-red-600">
          {error?.data?.message || "Error fetching coupons"}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {coupons.map((coupon) => (
            <div
              key={coupon._id}
              className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {coupon.templateCode}
              </h2>
              <p className="text-gray-700 mb-1">
                <strong>Discount:</strong> {coupon.discountValue}%
              </p>
              <p className="text-gray-700 mb-1">
                <strong>Points Required:</strong> {coupon.pointCost}
              </p>
              <p className="text-gray-700 mb-3">
                <strong>Description:</strong> {coupon.description}
              </p>

              {isUser ? (
                <button
                  onClick={() => handleRedeem(coupon._id)}
                  disabled={assigning}
                  className="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-full transition"
                >
                  {assigning ? "Redeeming..." : "Redeem Coupon"}
                </button>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  Admins cannot redeem coupons
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopCoupons;
