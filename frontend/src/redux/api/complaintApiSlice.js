import { apiSlice } from "./apiSlice";
import { COMPLAINT_URL } from "../constants";
// const COMPLAINT_URL = "/api/complaints";

export const complaintApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createComplaint: builder.mutation({
            query: (data) => ({
                url: COMPLAINT_URL,
                method: "POST",
                body: data,
            }),
        }),
        getMyComplaints: builder.query({
            query: () => `${COMPLAINT_URL}/mine`,
        }),
        getAllComplaints: builder.query({
            query: () => COMPLAINT_URL,
        }),
        deleteComplaint: builder.mutation({
            query: (id) => ({
                url: `${COMPLAINT_URL}/${id}`,
                method: "DELETE",
            }),
        }),
        getComplaintById: builder.query({
            query: (id) => `${COMPLAINT_URL}/${id}`,
        }),
    }),
});

export const {
    useCreateComplaintMutation,
    useGetMyComplaintsQuery,
    useGetAllComplaintsQuery,
    useDeleteComplaintMutation,
    useGetComplaintByIdQuery,
} = complaintApiSlice;
