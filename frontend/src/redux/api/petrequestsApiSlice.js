import { PET_REQUEST_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const petRequestApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Send a request to a pet owner
    addPetRequest: builder.mutation({
      query: (petId) => ({
        url: `${PET_REQUEST_URL}/${petId}`,
        method: "POST",
      }),
      invalidatesTags: ["PetRequests"],
    }),

    deletePetRequest: builder.mutation({
    query: (requestId) => ({
    url: `${PET_REQUEST_URL}/${requestId}`, // ✅ Send ID in query string
    method: "DELETE",
    }),
    invalidatesTags: ["PetRequests"],
    }),

  

    // Update request status (accept/reject by owner)
    updatePetRequestStatus: builder.mutation({
      query: ({ requestId, status }) => ({
        url: `${PET_REQUEST_URL}/${requestId}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["PetRequests"],
    }),

    // Get all incoming requests for the logged-in user (as owner)
    getIncomingRequests: builder.query({
      query: (status) =>
        status
          ? `${PET_REQUEST_URL}/incoming?status=${status}`
          : `${PET_REQUEST_URL}/incoming`,
      providesTags: ["PetRequests"],
    }),

    // Get all outgoing requests by the user (as requester)
    getOutgoingRequests: builder.query({
      query: (status) =>
        status
          ? `${PET_REQUEST_URL}/outgoing?status=${status}`
          : `${PET_REQUEST_URL}/outgoing`,
      providesTags: ["PetRequests"],
    }),
  }),
});

export const {
  useAddPetRequestMutation,
  useDeletePetRequestMutation,
  useUpdatePetRequestStatusMutation,
  useGetIncomingRequestsQuery,
  useGetOutgoingRequestsQuery,
} = petRequestApiSlice;
