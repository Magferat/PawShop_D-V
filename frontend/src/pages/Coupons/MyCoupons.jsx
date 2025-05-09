import React from "react";
import { useGetUserCouponsQuery } from "../../redux/api/couponApiSlice";

const MyCoupons = () => {
  const { data: userCoupons, isLoading, error } = useGetUserCouponsQuery();

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center text-yellow-600 tracking-wide">
        My Coupons
      </h1>

      {isLoading ? (
        <p className="text-center text-gray-500">Loading your coupons...</p>
      ) : error ? (
        <p className="text-red-600 text-center">
          {error?.data?.message || "Failed to load coupons"}
        </p>
      ) : userCoupons.length === 0 ? (
        <p className="text-gray-500 text-center">
          You haven't redeemed any coupons yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {userCoupons.map((coupon) => (
            <div
              key={coupon._id}
              className="relative bg-yellow-50 border-2 border-dashed border-yellow-300 rounded-3xl p-6 shadow-lg transition transform hover:scale-105"
            >
              {/* Ticket edge circles */}
              <div className="absolute -left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white rounded-full border-2 border-yellow-300"></div>
              <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white rounded-full border-2 border-yellow-300"></div>

              <h2 className="text-2xl font-bold text-yellow-700 mb-3 tracking-wide">
                {coupon.couponTemplate?.templateCode || "Coupon"}
              </h2>

              <p className="mb-2 text-gray-700">
                <span className="font-semibold text-yellow-800">Discount:</span>{" "}
                {coupon.couponTemplate?.discountValue}%
              </p>
              <p className="mb-2 text-gray-700">
                <span className="font-semibold text-yellow-800">Description:</span>{" "}
                {coupon.couponTemplate?.description || "-"}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold text-yellow-800">Quantity:</span>{" "}
                {coupon.quantity}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCoupons;
