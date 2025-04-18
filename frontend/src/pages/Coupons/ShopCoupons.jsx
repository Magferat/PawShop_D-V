import React from "react";
import { useGetCouponsQuery, useAssignCouponMutation } from "../../redux/api/couponApiSlice";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const ShopCoupons = () => {
  const { data: coupons, isLoading, error } = useGetCouponsQuery();
  const [assignCoupon, { isLoading: assigning }] = useAssignCouponMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const handleRedeem = async (couponId) => {
    try {
      const res = await assignCoupon(couponId).unwrap();
      toast.success("Coupon redeemed successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Could not redeem coupon");
    }
  };

  const isUser = userInfo && !userInfo.isAdmin;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-black text-3xl font-bold mb-6 text-center">Available Coupons</h1>

      {isLoading ? (
        <p>Loading coupons...</p>
      ) : error ? (
        <p className="text-red-600">{error?.data?.message || "Error fetching coupons"}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {coupons.map((coupon) => (
            <div
              key={coupon._id}
              className="text-black border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition"
            >
              <h2 className="text-black text-xl font-semibold mb-2">{coupon.templateCode}</h2>
              <p className="mb-1">
                <strong className="text-black">Discount:</strong> {coupon.discountValue}%
              </p>
              <p className="text-black mb-1">
                <strong>Points Required:</strong> {coupon.pointCost}
              </p>
              <p className="text-black mb-2">
                <strong>Description:</strong> {coupon.description}
              </p>

              {isUser ? (
                <button
                  onClick={() => handleRedeem(coupon._id)}
                  disabled={assigning}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  {assigning ? "Redeeming..." : "Redeem Coupon"}
                </button>
              ) : (
                <p className="text-black text-sm text-gray-500 italic">Admins cannot redeem coupons</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopCoupons;
