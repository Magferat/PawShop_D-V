import { useParams, useNavigate } from "react-router-dom";
import {
  useGetMyAppointmentsQuery,
  useCancelAppointmentMutation,
  useClearGoogleEventIdMutation,
  useApplyOrRemoveCouponMutation,
} from "../../redux/api/appointmentApiSlice";
import { useGetUserCouponsQuery } from "../../redux/api/couponApiSlice";
import { toast } from "react-toastify";
import { gapi } from "gapi-script";
import { useEffect, useState } from "react";

const AppointmentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: appointments, isLoading, error, refetch } = useGetMyAppointmentsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [cancelAppointment, { isLoading: isCancelling }] = useCancelAppointmentMutation();
  const [applyOrRemoveCoupon, { isLoading: isApplying }] = useApplyOrRemoveCouponMutation();
  const { data: userCoupons, isLoading: loadingCoupons } = useGetUserCouponsQuery();
  const [showCouponModal, setShowCouponModal] = useState(false);

  const appointment = appointments?.find((appt) => appt._id === id);

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        scope: "https://www.googleapis.com/auth/calendar",
      });
    }
    gapi.load("client:auth2", start);
  }, []);

  const handleCancel = async () => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await cancelAppointment(id).unwrap();
        toast.success("Appointment cancelled successfully.");

        if (appointment.googleEventId) {
          gapi.auth2.getAuthInstance().signIn().then(() => {
            gapi.client.load("calendar", "v3").then(() => {
              gapi.client.calendar.events.delete({
                calendarId: "primary",
                eventId: appointment.googleEventId,
              }).then(() => {
                console.log("Google Calendar event deleted.");
              }).catch(console.error);
            });
          });
        }

        navigate("/calendar");
      } catch (err) {
        console.error(err);
        toast.error(err?.data?.error || "Failed to cancel appointment.");
      }
    }
  };

  const handleCoupon = async (action, userCouponId) => {
    try {
      await applyOrRemoveCoupon({ appointmentId: appointment._id, action, userCouponId }).unwrap();
      toast.success(`Coupon ${action === "apply" ? "applied" : "removed"} successfully`);
      setShowCouponModal(false);
      refetch();
      
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.error || `Failed to ${action} coupon`);
    }
  };

  if (isLoading) return <p className="text-center mt-10">Loading appointment details...</p>;
  if (error) return <p className="text-center text-red-600 mt-10">Error loading appointment.</p>;
  if (!appointment) return <p className="text-center mt-10">Appointment not found.</p>;

  const { service, date, timeSlot, status, packageId, couponUsed } = appointment;
  const servicePackage = service?.packages?.find((pkg) => pkg._id === packageId);

  const applicableCoupons = userCoupons?.filter((uc) => {
    const code = uc.couponTemplate.templateCode.toUpperCase();
    const category = service?.category.toLowerCase();
    return (
      uc.quantity > 0 && (
      (category === "grooming" && code.includes("GROOM")) ||
      (category === "vet" && code.includes("VET")))
    );
  });

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Appointment Details</h1>

      <div className="bg-dustyyellow/50 border border-dustyyellow rounded-2xl shadow p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-3">{service?.name}</h2>
        <p className="mb-2">{service?.description}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <p><strong>Address:</strong> {service?.address}</p>
          <p><strong>Contact:</strong> {service?.email} | {service?.phone}</p>
          <p><strong>Category:</strong> {service?.category}</p>
          <p><strong>Working Hours:</strong> {service?.workingHours?.start} - {service?.workingHours?.end}</p>
        </div>
      </div>

      {servicePackage && (
        <div className="bg-dustypink/30 border border-dustypink rounded-2xl shadow p-6 mb-6">
          <h3 className="text-xl font-semibold mb-3">Package: {servicePackage.name}</h3>
          <p className="mb-2">{servicePackage.description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <p><strong>Pet Types:</strong> {servicePackage.petType.join(", ")}</p>
            <p><strong>Duration:</strong> {servicePackage.duration} minutes</p>
            <p><strong>Price:</strong> BDT {servicePackage.price}</p>
          </div>
        </div>
      )}

      <div className="bg-dustygreen/30 border border-dustygreen rounded-2xl shadow p-6 mb-6">
        <h3 className="text-xl font-semibold mb-3">Booking Info</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <p><strong>Date:</strong> {new Date(date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> {timeSlot}</p>
          <p><strong>Status:</strong> {status}</p>
          <p><strong>Coupon Applied:</strong> {couponUsed ? "Yes" : "No"}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
        <button
          className="bg-dustybrown text-white px-5 py-2 rounded-2xl shadow hover:bg-opacity-90 transition"
          onClick={handleCancel}
          disabled={isCancelling}
        >
          {isCancelling ? "Cancelling..." : "Cancel Appointment"}
        </button>
        <button
          className="bg-dustygreen text-white px-5 py-2 rounded-2xl shadow hover:bg-opacity-90 transition"
          onClick={() => setShowCouponModal(true)}
        >
          {couponUsed ? "Manage Coupon" : "Apply Coupon"}
        </button>
      </div>

      {showCouponModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-2xl w-full max-w-lg shadow relative">
            <button
              className="absolute top-2 right-3 text-gray-400 hover:text-red-500"
              onClick={() => setShowCouponModal(false)}
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">Available Coupons</h2>

            {loadingCoupons ? (
              <p>Loading...</p>
            ) : applicableCoupons?.length === 0 ? (
              <p>No applicable coupons available.</p>
            ) : (
              <ul className="space-y-4 max-h-80 overflow-y-auto">
                {applicableCoupons.map((uc) => (
                  <li
                    key={uc._id}
                    className="border p-4 rounded-xl flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">{uc.couponTemplate.templateCode}</p>
                      <p className="text-sm text-gray-600">{uc.couponTemplate.description}</p>
                    </div>
                    {couponUsed?(
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded"
                        onClick={() => handleCoupon("remove", couponUsed._id)}
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        className="bg-green-600 text-white px-3 py-1 rounded"
                        onClick={() => handleCoupon("apply", uc._id)}
                      >
                        Apply
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentDetailsPage;
