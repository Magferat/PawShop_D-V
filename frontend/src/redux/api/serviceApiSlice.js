// features/api/serviceApiSlice.js
import { apiSlice } from "./apiSlice";
import { SERVICE_URL } from "../constants";

export const serviceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // Public: Get all services
    getAllServices: builder.query({
      query: () => `${SERVICE_URL}`,
      providesTags: ["Services"],
    }),

    // Public: Get a single service by ID
    getServiceById: builder.query({
      query: (id) => `${SERVICE_URL}/${id}`,
      providesTags: (result, error, id) => [{ type: "Services", id }],
    }),

    // Add the getPackageById query here
    getPackageById: builder.query({
      query: ({ serviceId, packageId }) => `${SERVICE_URL}/${serviceId}/packages/${packageId}`,
      providesTags: (result, error, { packageId }) => [{ type: "Packages", packageId }],
    }),



    // Admin: Create a service
    createService: builder.mutation({
      query: (data) => ({
        url: `${SERVICE_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Services"],
    }),

    // Admin: Update a service
    updateService: builder.mutation({
      query: ({ id, data }) => ({
        url: `${SERVICE_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Services", id },
        "Services",
      ],
    }),

    // Admin: Delete a service
    deleteService: builder.mutation({
      query: (id) => ({
        url: `${SERVICE_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Services"],
    }),

    // Admin: Add a package to a service
    addPackage: builder.mutation({
      query: ({ serviceId, data }) => ({
        url: `${SERVICE_URL}/${serviceId}/packages`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { serviceId }) => [
        { type: "Services", id: serviceId },
      ],
    }),

    // Admin: Update a package within a service
    updatePackage: builder.mutation({
      query: ({ serviceId, packageId, data }) => ({
        url: `${SERVICE_URL}/${serviceId}/packages/${packageId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { serviceId }) => [
        { type: "Services", id: serviceId },
      ],
    }),

    // Admin: Delete a package within a service
    deletePackage: builder.mutation({
      query: ({ serviceId, packageId }) => ({
        url: `${SERVICE_URL}/${serviceId}/packages/${packageId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { serviceId }) => [
        { type: "Services", id: serviceId },
      ],
    }),

  }),

});

export const {
  useGetAllServicesQuery,
  useGetServiceByIdQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useAddPackageMutation,
  useUpdatePackageMutation,
  useDeletePackageMutation,
  useGetPackageByIdQuery,
} = serviceApiSlice;
