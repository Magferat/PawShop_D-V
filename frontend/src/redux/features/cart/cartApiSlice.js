import { apiSlice } from "../../api/apiSlice";
import { CART_URL } from "../../constants";

export const cartApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        addToCart: builder.mutation({
            query: ({ productId, qty }) => ({
                url: CART_URL,
                method: "POST",
                body: { productId, qty },
            }),
            invalidatesTags: ["Cart"],
        }),
        getCart: builder.query({
            query: () => CART_URL,
            providesTags: ["Cart"]
        }),
        updateQty: builder.mutation({
            query: ({ productId, qty }) => ({
                url: `${CART_URL}/update/${productId}`,
                method: "PUT",
                body: { qty }
            }),
            invalidatesTags: ["Cart"]
        }),
        removeFromCart: builder.mutation({
            query: productId => ({
                url: `${CART_URL}/remove/${productId}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Cart"]
        }),
        clearCart: builder.mutation({
            query: () => ({
                url: `${CART_URL}/clear`,
                method: "DELETE"
            }),
            invalidatesTags: ["Cart"]
        })
    })
});

export const {
    useGetCartQuery,
    useAddToCartMutation,
    useUpdateQtyMutation,
    useRemoveFromCartMutation,
    useClearCartMutation
} = cartApiSlice;