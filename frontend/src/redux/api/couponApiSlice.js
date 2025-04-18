import { COUPON_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const couponApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Public: Get all coupon templates
    getCoupons: builder.query({
      query: () => `${COUPON_URL}`,
      providesTags: ["Coupons"],
      keepUnusedDataFor: 5,
    }),

    // Admin: Create a coupon template
    createCoupon: builder.mutation({
      query: (data) => ({
        url: `${COUPON_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Coupons"],
    }),

    // Admin: Delete a coupon template
    deleteCoupon: builder.mutation({
      query: (id) => ({
        url: `${COUPON_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Coupons"],
    }),

    // User: Assign a coupon (redeem)
    assignCoupon: builder.mutation({
      query: (id) => ({
        url: `${COUPON_URL}/${id}/redeem`,
        method: "PATCH",
      }),
      invalidatesTags: ["UserCoupons"],
    }),

    // User: Get their own coupons
    getUserCoupons: builder.query({
      query: () => `${COUPON_URL}/my-coupons`,
      providesTags: ["UserCoupons"],
      keepUnusedDataFor: 5,
    }),

    // User: Mark an assigned coupon as used (optional)
    redeemCoupon: builder.mutation({
      query: (data) => ({
        url: `${COUPON_URL}/use`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["UserCoupons"],
    }),
  }),
});

export const {
  useGetCouponsQuery,
  useCreateCouponMutation,
  useDeleteCouponMutation,
  useAssignCouponMutation,
  useGetUserCouponsQuery,
  useRedeemCouponMutation,
} = couponApiSlice;
