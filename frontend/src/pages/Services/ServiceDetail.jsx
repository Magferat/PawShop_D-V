import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useGetServiceByIdQuery } from "../../redux/api/serviceApiSlice";
import { useCheckAvailableTimeSlotsMutation, useBookAppointmentMutation } from "../../redux/api/appointmentApiSlice";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux"; 
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ServiceDetailPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const { data: service, isLoading, error } = useGetServiceByIdQuery(serviceId);

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [notes, setNotes] = useState("");
  const [booking, setBooking] = useState(false);

  const [checkAvailableTimeSlots, { data: availableSlotsResponse, isLoading: checkingSlots }] =
    useCheckAvailableTimeSlotsMutation();

  const [bookAppointment] = useBookAppointmentMutation();

  const userInfo = useSelector((state) => state.auth);
  const isAdmin = userInfo && userInfo.isAdmin;

  useEffect(() => {
    if (selectedPackage && selectedDate) {
      const yyyy = selectedDate.getFullYear();
      const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const dd = String(selectedDate.getDate()).padStart(2, '0');
      const localDateString = `${yyyy}-${mm}-${dd}`;
  
      checkAvailableTimeSlots({
        serviceId,
        packageId: selectedPackage._id,
        date: localDateString,
      });
      setSelectedTime(null);
    }
  }, [selectedPackage, selectedDate, checkAvailableTimeSlots, serviceId]);

  const handleBooking = async () => {
    if (!selectedPackage || !selectedDate || !selectedTime) {
      toast.error("Please select a package, date, and time before booking.");
      return;
    }

    try {
      setBooking(true);
      await bookAppointment({
        serviceId,
        packageId: selectedPackage._id,
        date: selectedDate.toISOString(),
        timeSlot: selectedTime,
        notes: notes.trim(),
      }).unwrap();
      
      toast.success("Appointment booked successfully!");
      setNotes("");  // Clear notes after booking

      // Redirect to calendar page
      navigate("/calendar");
    } catch (err) {
      console.error(err);
      if (err?.data?.message) {
        toast.error(err.data.message);
      } else if (err?.data?.error) {
        toast.error(err.data.error);
      }
       else {
        toast.error("Failed to book appointment. Please try again.");
      }
    } finally {
      setBooking(false);
    }
  };

  if (isLoading) return <p className="p-6 text-center text-gray-700">Loading service details...</p>;
  if (error) {
    toast.error("Failed to load service details.");
    return <p className="p-6 text-center text-red-500">Failed to load service.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-dustyyellow/20 border border-dustybrown rounded-2xl p-6 mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">{service.name}</h1>
        <p className="text-gray-700 mb-4">{service.description}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700 text-sm">
          <p><span className="font-semibold">Category:</span> {service.category}</p>
          <p><span className="font-semibold">Address:</span> {service.address}</p>
          <p><span className="font-semibold">Email:</span> {service.email}</p>
          <p><span className="font-semibold">Phone:</span> {service.phone}</p>
          <p>
            <span className="font-semibold">Working Hours:</span>{" "}
            {service.workingHours?.start} - {service.workingHours?.end}
          </p>
        </div>
      </div>

      {isAdmin && (
        <p className="text-red-500 text-xl mb-6">Admins cannot book appointments.</p>
      )}

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2 text-gray-900">Select a Package</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {service.packages.map((pkg) => (
            <button
              key={pkg._id}
              onClick={() => setSelectedPackage(pkg)}
              className={`border rounded-2xl p-4 text-left transition hover:shadow-lg ${
                selectedPackage?._id === pkg._id
                  ? "border-dustybrown bg-dustyyellow/30"
                  : "border-gray-300"
              }`}
            >
              <h3 className="font-bold text-lg text-gray-900">{pkg.name}</h3>
              <p className="text-sm text-gray-700 mt-1">{pkg.description}</p>
              <p className="mt-2 text-sm text-gray-700">
                Duration: {pkg.duration} mins | Price: BDT {pkg.price}
              </p>
              <p className="mt-2 text-sm text-gray-700">
                Suitable for: {pkg.petType.join(", ")}
              </p>
              <p className="mt-2 text-sm text-red-700" >
                Note that the prices listed are the base price for the package. Additional charges may apply based on the pet's condition, size and any extra services requested. Please contact us for more details.
              </p>
            </button>
          ))}
        </div>
      </div>

      {selectedPackage && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2 text-gray-900">Choose a Date</h2>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            minDate={new Date()}
            className="border border-gray-300 p-3 rounded-lg w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-dustybrown"
            placeholderText="Select a date"
          />
        </div>
      )}

      {selectedPackage && selectedDate && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2 text-gray-900">Available Time Slots</h2>
          {checkingSlots ? (
            <p className="text-gray-600">Loading available times...</p>
          ) : availableSlotsResponse?.availableSlots?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {availableSlotsResponse.availableSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`px-4 py-2 border rounded-lg transition ${
                    selectedTime === time
                      ? "bg-dustybrown text-white"
                      : "border-gray-300 hover:bg-dustyyellow/30 text-gray-800"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No available slots for this date.</p>
          )}
        </div>
      )}

      {selectedPackage && selectedDate && selectedTime && !isAdmin && (
        <div className="mt-8 space-y-4">
          <div>
            <h2 className="text-2xl font-semibold mb-2 text-gray-900">Add Notes (optional)</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any special instructions or notes..."
              rows={4}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-dustybrown"
            />
          </div>
          <button
            onClick={handleBooking}
            disabled={booking}
            className="px-6 py-3 bg-dustybrown text-white rounded-2xl hover:bg-dustybrown/90 transition disabled:opacity-50"
          >
            {booking ? "Booking..." : "Confirm Booking"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ServiceDetailPage;
