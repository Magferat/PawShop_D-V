import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";

const baseQuery = fetchBaseQuery({ baseUrl: BASE_URL, credentials: 'include' });

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["Product", "Order", "User", "Category", "Pet", "PetRequests", "Services", "Packages", "Coupons", "Cart", "UserCoupons", "Appointments"],
  endpoints: () => ({}),
});
