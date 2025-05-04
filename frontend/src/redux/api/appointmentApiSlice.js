// features/api/appointmentApiSlice.js
import { apiSlice } from "./apiSlice";
import { APPOINTMENT_URL } from "../constants";

export const appointmentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyAppointments: builder.query({
      query: () => `${APPOINTMENT_URL}/myappointments`,
      providesTags: ["Appointments"],
    }),
    bookAppointment: builder.mutation({
      query: (data) => ({
        url: `${APPOINTMENT_URL}/book`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Appointments"],
    }),
    cancelAppointment: builder.mutation({
      query: (id) => ({
        url: `${APPOINTMENT_URL}/${id}/cancel`,
        method: "PUT",  // ✅ keep if your backend uses PUT
      }),
      invalidatesTags: ["Appointments"],
    }),
    checkAvailableTimeSlots: builder.mutation({
      query: (data) => ({
        url: `${APPOINTMENT_URL}/available-times`,
        method: "POST",
        body: data,
      }),
    }),
    
    updateAppointmentStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `${APPOINTMENT_URL}/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Appointments"],
    }),

    saveGoogleEventId: builder.mutation({
      query: ({ appointmentId, googleEventId }) => ({
        url: `${APPOINTMENT_URL}/${appointmentId}/google-event`,
        method: 'PUT',
        body: { googleEventId },
      }),
    }),
  
    clearGoogleEventId: builder.mutation({
      query: (appointmentId) => ({
        url: `${APPOINTMENT_URL}/${appointmentId}/clear-google-event`,
        method: 'PUT',
      }),
    }),

    applyOrRemoveCoupon: builder.mutation({
      query: ({ appointmentId, action, userCouponId }) => ({
        url: `${APPOINTMENT_URL}/${appointmentId}/coupon`,
        method: 'PUT',
        body: { action, userCouponId },
      }),
      invalidatesTags: ['Appointment', 'UserCoupon'], // Invalidate relevant cache if needed
    }),


  }),
});

export const {
  useGetMyAppointmentsQuery,
  useBookAppointmentMutation,
  useCancelAppointmentMutation,
  useCheckAvailableTimeSlotsMutation,
  useUpdateAppointmentStatusMutation,
  useSaveGoogleEventIdMutation,
  useClearGoogleEventIdMutation,
  useApplyOrRemoveCouponMutation,
} = appointmentApiSlice;
