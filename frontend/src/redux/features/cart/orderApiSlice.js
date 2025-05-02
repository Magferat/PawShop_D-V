// api/orderApi/Slice

import { apiSlice } from "../../api/apiSlice";
import { ORDERS_URL } from "../../constants";

export const orderApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (order) => ({
                url: ORDERS_URL, // api/orders
                method: "POST",
                body: order,
            }),
        }),

        getOrderDetails: builder.query({
            query: (id) => ({
                url: `${ORDERS_URL}/${id}`,
            }),
        }),

        getMyOrders: builder.query({
            query: () => ({
                url: `${ORDERS_URL}/mine`,
            }),
            keepUnusedDataFor: 5,
        }),

        getAllOrders: builder.query({
            query: () => ({
                url: ORDERS_URL,
            }),
        }),
        // features/api/orderApiSlice.js



        deliverOrder: builder.mutation({
            query: (orderId) => ({
                url: `${ORDERS_URL}/${orderId}/deliver`,
                method: "PUT",
            }),
        }),

        getTotalOrders: builder.query({
            query: () => `${ORDERS_URL}/total-orders`,
        }),

        getTotalSales: builder.query({
            query: () => `${ORDERS_URL}/total-sales`,
        }),

        getTotalSalesByDate: builder.query({
            query: () => `${ORDERS_URL}/total-sales-by-date`,
        }),
    }),
});

export const {
    useGetTotalOrdersQuery,
    useGetTotalSalesQuery,
    useGetTotalSalesByDateQuery,
    // ------------------
    useCreateOrderMutation,
    useGetOrderDetailsQuery,
    useGetMyOrdersQuery,
    useDeliverOrderMutation,
    // useGetOrdersQuery,
    useGetAllOrdersQuery,

} = orderApiSlice;
