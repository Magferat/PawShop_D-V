import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../constants";
import { PET_URL } from "../constants";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),
    profile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
      }),
    }),
    getUsers: builder.query({
      query: () => ({
        url: USERS_URL,
      }),
      providesTags: ["User"],
      keepUnusedDataFor: 5,
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
        method: "DELETE",
      }),
    }),
    getUserDetails: builder.query({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),

    // Get public profile of pet owner
    getPublicUserProfile: builder.query({
      query: (id) => `/api/users/${id}/reviews`, // This should return username, email, reviews, etc.
    }),

   // Add review
    createUserReview: builder.mutation({
      query: ({ userId, rating, comment }) => ({
        url: `/api/users/${userId}/reviews`,
        method: "POST",
        body: { rating, comment },
      }),
    }),

    // Delete review
    deleteUserReview: builder.mutation({
      query: ({ userId, reviewId }) => ({
        url: `/api/users/${userId}/reviews/${reviewId}`,
        method: "DELETE",
      }),
    }),

    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/${data.userId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useProfileMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetUserDetailsQuery,
  useCreateUserReviewMutation,
  useDeleteUserReviewMutation,
  useGetPublicUserProfileQuery,
} = userApiSlice;
