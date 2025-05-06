import React from "react";
import {
  useGetCouponsQuery,
  useAssignCouponMutation,
  useGetUserCouponsQuery,
} from "../../redux/api/couponApiSlice";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaTicketAlt, FaCoins } from "react-icons/fa";

const ShopCoupons = () => {
  const { data: coupons, isLoading, error } = useGetCouponsQuery();
  const [assignCoupon, { isLoading: assigning }] = useAssignCouponMutation();
  const { refetch: refetchUserCoupons } = useGetUserCouponsQuery(); // for live updates

  const { userInfo } = useSelector((state) => state.auth);

  const handleRedeem = async (couponId) => {
    try {
      await assignCoupon(couponId).unwrap();
      toast.success("Coupon redeemed successfully!");
      refetchUserCoupons(); // refresh user coupons
    } catch (err) {
      toast.error(err?.data?.message || "Could not redeem coupon");
    }
  };

  const isUser = userInfo && !userInfo.isAdmin;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center text-pink-700">
        🎟️ Available Coupons
      </h1>

      {/* {userInfo && isUser && (
        <div className="flex justify-center items-center mb-8 text-lg bg-yellow-50 border border-yellow-200 rounded-full px-6 py-3 shadow-md w-fit mx-auto">
          <FaCoins className="text-yellow-500 mr-3 text-xl" />
          <span className="text-gray-700 font-semibold">
            Your Points: {userInfo.points ?? 0}
          </span>
        </div>
      )} */}

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
              className="relative bg-pink-50 border-2 border-dashed border-pink-300 rounded-2xl p-5 shadow hover:shadow-lg transition overflow-hidden"
            >
              {/* Left side circle cutout */}
              <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2 bg-white w-8 h-8 rounded-full border border-pink-200"></div>
              {/* Right side circle cutout */}
              <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2 bg-white w-8 h-8 rounded-full border border-pink-200"></div>

              <div className="flex items-center mb-4">
                <FaTicketAlt className="text-pink-600 text-2xl mr-3" />
                <h2 className="text-xl font-bold text-pink-700">
                  {coupon.templateCode}
                </h2>
              </div>
              <p className="text-gray-700 mb-1">
                <strong>Discount:</strong> {coupon.discountValue}%
              </p>
              <p className="text-gray-700 mb-1">
                <strong>Points Required:</strong> {coupon.pointCost}
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Description:</strong> {coupon.description}
              </p>

              {isUser ? (
                <button
                  onClick={() => handleRedeem(coupon._id)}
                  disabled={assigning}
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold px-5 py-2 rounded-full transition shadow-md"
                >
                  {assigning ? "Redeeming..." : "Redeem Coupon"}
                </button>
              ) : (
                <p className="text-sm text-gray-500 italic text-center">
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
