import { useParams, useNavigate} from "react-router-dom";
import { useGetMyAppointmentsQuery, useCancelAppointmentMutation, useClearGoogleEventIdMutation } from "../../redux/api/appointmentApiSlice";
import { toast } from "react-toastify";
import { gapi } from "gapi-script";
import { useEffect } from "react";

const AppointmentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: appointments, isLoading, error } = useGetMyAppointmentsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [cancelAppointment, { isLoading: isCancelling }] = useCancelAppointmentMutation();

  const appointment = appointments?.find((appt) => appt._id === id);

  if (isLoading) return <p className="text-center text-gray-700 mt-10">Loading appointment details...</p>;
  if (error) return <p className="text-center text-red-600 mt-10">Error loading appointment details.</p>;
  if (!appointment) return <p className="text-center text-gray-700 mt-10">Appointment not found.</p>;

  const { service, date, timeSlot, status, packageId } = appointment;

  const servicePackage = service.packages.find((pkg) => pkg._id === packageId);

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: CLIENT_ID, // ⬅️ Same CLIENT_ID you used before
        scope: SCOPES,
      });
    }
    gapi.load("client:auth2", start);
  }, []);

  const handleCancel = async () => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await cancelAppointment(id).unwrap();
        toast.success("Appointment cancelled successfully.");
        console.log(appointment.googleEventId);
  
        // 👇 Remove from Google Calendar if a googleEventId exists
        if (appointment.googleEventId) {
          gapi.auth2.getAuthInstance().signIn().then(() => {
            gapi.client.load('calendar', 'v3').then(() => {
              gapi.client.calendar.events.delete({
                calendarId: 'primary',
                eventId: appointment.googleEventId,
              }).then(() => {
                console.log("Google Calendar event deleted successfully.");
              }).catch((err) => {
                console.error("Failed to delete Google Calendar event:", err);
                console.error("Failed to delete Google Calendar event:", err);
              });
            });
          });
        }
  
        navigate("/calendar");
      } catch (err) {
        console.error(err);
        toast.error("Failed to cancel the appointment.");
      }
    }
  };


  

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Appointment Details</h1>

      <div className="bg-dustyyellow/50 border border-dustyyellow rounded-2xl shadow p-6 mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">{service?.name}</h2>
        <p className="text-gray-700 mb-2">{service?.description}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-800">
          <p><span className="font-semibold">Address:</span> {service?.address}</p>
          <p><span className="font-semibold">Contact:</span> {service?.email} | {service?.phone}</p>
          <p><span className="font-semibold">Category:</span> {service?.category}</p>
          <p><span className="font-semibold">Working Hours:</span> {service?.workingHours?.start} - {service?.workingHours?.end}</p>
        </div>
      </div>

      {servicePackage && (
        <div className="bg-dustypink/30 border border-dustypink rounded-2xl shadow p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Package: {servicePackage.name}</h3>
          <p className="text-gray-700 mb-2">{servicePackage.description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-800">
            <p><span className="font-semibold">Pet Types:</span> {servicePackage.petType.join(", ")}</p>
            <p><span className="font-semibold">Duration:</span> {servicePackage.duration} minutes</p>
            <p><span className="font-semibold">Price:</span> ${servicePackage.price}</p>
          </div>
        </div>
      )}

      <div className="bg-dustygreen/30 border border-dustygreen rounded-2xl shadow p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">Booking Info</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-800">
          <p><span className="font-semibold">Date:</span> {new Date(date).toLocaleDateString()}</p>
          <p><span className="font-semibold">Time:</span> {timeSlot}</p>
          <p><span className="font-semibold">Status:</span> {status.charAt(0).toUpperCase() + status.slice(1)}</p>
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
          onClick={() => toast("Coupon logic will go here")}
        >
          Apply Coupon
        </button>
      </div>
    </div>
  );
};

export default AppointmentDetailsPage;
