import { PET_URL } from "../constants";
import { UPLOAD_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const petApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPets: builder.query({
      query: ({ keyword }) => ({
        url: `${PET_URL}`,
        params: { keyword },
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Pets"],
    }),

    getPetById: builder.query({
      query: (petId) => `${PET_URL}/${petId}`,
      providesTags: (result, error, petId) => [
        { type: "Pet", id: petId },
      ],
    }),

    allPets: builder.query({
      query: () => `${PET_URL}/petlist`,
      providesTags: ["Pet"],
    }),

    getPetDetails: builder.query({
      query: (petId) => ({
        url: `${PET_URL}/${petId}`,
      }),
      keepUnusedDataFor: 5,
    }),

    createPet: builder.mutation({
      query: (petData) => ({
        url: `${PET_URL}/addpet`,
        method: "POST",
        body: petData,
      }),
      invalidatesTags: ["Pet"],
    }),

    uploadPetImage: builder.mutation({
      query: (data) => ({
        url: `${UPLOAD_URL}`,
        method: "POST",
        body: data,
      }),
    }),

    updatePet: builder.mutation({
      query: ({ petId, formData }) => {
        return {
          url: `${PET_URL}/${petId}`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: ["Pet"],
    }),

    deletePet: builder.mutation({
      query: (petId) => ({
        url: `${PET_URL}/${petId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Pet"],
    }),

    getFilteredPets: builder.query({
      query: ({ checked, search }) => ({
        url: `${PET_URL}/filtered-pets`,
        method: "POST",
        body: { checked, search},
      }),
      providesTags: ["Pets"],
    }),
  }),
});

export const {
  useGetPetsQuery,
  useGetPetByIdQuery,
  useGetPetDetailsQuery,
  useAllPetsQuery,
  useCreatePetMutation,
  useUpdatePetMutation,
  useDeletePetMutation,
  useGetFilteredPetsQuery,
  useUploadPetImageMutation,
} = petApiSlice;