import React from "react";
import { useGetUserCouponsQuery } from "../../redux/api/couponApiSlice";

const MyCoupons = () => {
  const { data: userCoupons, isLoading, error } = useGetUserCouponsQuery();

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">My Coupons</h1>

      {isLoading ? (
        <p>Loading your coupons...</p>
      ) : error ? (
        <p className="text-red-600">
          {error?.data?.message || "Failed to load coupons"}
        </p>
      ) : userCoupons.length === 0 ? (
        <p className="text-gray-600 text-center">You haven't redeemed any coupons yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {userCoupons.map((coupon) => (
            <div
              key={coupon._id}
              className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold mb-2">
                {coupon.couponTemplate?.templateCode || "N/A"}
              </h2>
              <p className="mb-1">
                <strong>Discount:</strong> {coupon.couponTemplate?.discountValue}%
              </p>
              <p className="mb-1">
                <strong>Description:</strong> {coupon.couponTemplate?.description || "-"}
              </p>
              <p className="mb-1">
                <strong>Quantity:</strong> {coupon.quantity}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCoupons;
