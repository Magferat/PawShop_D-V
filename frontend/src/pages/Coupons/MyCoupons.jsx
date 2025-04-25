import React from "react";
import { useGetUserCouponsQuery } from "../../redux/api/couponApiSlice";
import { format } from "date-fns";

const MyCoupons = () => {
  const { data: userCoupons, isLoading, error } = useGetUserCouponsQuery();
  console.log(userCoupons)

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">My Coupons</h1>

      {isLoading ? (
        <p>Loading your coupons...</p>
      ) : error ? (
        <p className="text-red-600">{error?.data?.message || "Failed to load coupons"}</p>
      ) : userCoupons.length === 0 ? (
        <p className="text-gray-600 text-center">You haven't redeemed any coupons yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {userCoupons.map((coupon) => (
            <div
              key={coupon._id}
              className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold mb-2">{coupon.couponTemplate?.templateCode || "N/A"}</h2>
              <p className="mb-1">
                <strong>Discount:</strong> {coupon.couponTemplate?.discountValue}%
              </p>
              <p className="mb-1">
                <strong>Description:</strong> {coupon.couponTemplate?.description || "-"}
              </p>
              <p className="mb-1">
                <strong>Unique Code:</strong> <span className="font-mono">{coupon.uniqueCode}</span>
              </p>
              <p className="text-sm text-gray-500">
                Redeemed on: {format(new Date(coupon.redeemedAt), "PPP")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCoupons;
