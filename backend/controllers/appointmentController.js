import asyncHandler from "../middlewares/asyncHandler.js";
import Appointment from "../models/appointmentModel.js";
import Service from "../models/serviceModel.js";
import moment from "moment-timezone";
import UserCoupon from "../models/userCouponModel.js"; 

// Helper functions
const timeToMinutes = (timeStr) => {
  const [hour, min] = timeStr.split(":").map(Number);
  return hour * 60 + min;
};

const minutesToTime = (mins) => {
  const h = String(Math.floor(mins / 60)).padStart(2, "0");  //padStart: Ensures the string is at least 2 characters long, adding a leading "0" if necessary (e.g., "2" becomes "02")
  const m = String(mins % 60).padStart(2, "0");
  return `${h}:${m}`;
};

// // Get start and end of a date in UTC
// const getDateRange = (dateStr) => {
//   const dayStart = new Date(dateStr);
//   dayStart.setUTCHours(0, 0, 0, 0);

//   const dayEnd = new Date(dateStr);
//   dayEnd.setUTCHours(23, 59, 59, 999);

//   return { dayStart, dayEnd };
// };

const getDateRange = (dateStr) => {
  const tz = 'Asia/Dhaka';  // Bangladesh timezone

  const dayStart = moment.tz(dateStr, tz).startOf('day').toDate();
  const dayEnd = moment.tz(dateStr, tz).endOf('day').toDate();             //dayEnd: Date("2025-05-04T23:59:59.999+06:00")

  return { dayStart, dayEnd };
};

const generateAvailableSlots = async (service, packageDuration, date) => {
  const { dayStart, dayEnd } = getDateRange(date);

  const startMins = timeToMinutes(service.workingHours.start);
  const endMins = timeToMinutes(service.workingHours.end);

  //Check any existing appointments for the service on the given date
  const existingAppointments = await Appointment.find({
    service: service._id,
    date: { $gte: dayStart, $lte: dayEnd },
    status: { $in: ["pending", "confirmed"] },
  });

  //Array of booked time slots {start, end}
  const booked = existingAppointments.map((appt) => {
    const apptStart = timeToMinutes(appt.timeSlot);
    const apptDuration = appt.packageDuration || 0; // fallback
    return {
      start: apptStart,
      end: apptStart + apptDuration,
    };
  });

  const slots = [];
  for (let t = startMins; t + packageDuration <= endMins; t += 30) {    //loops from startMins to endMins in 30-minute increments
    const end = t + packageDuration;
    const overlaps = booked.some((b) => !(end <= b.start || t >= b.end));  // Check if the current slot overlaps with any booked slots
    if (!overlaps) slots.push(minutesToTime(t));
  }

  return slots;
};

// Book appointment
const bookAppointment = asyncHandler(async (req, res) => {
  const { serviceId, packageId, date, timeSlot, notes } = req.body;

  if (!serviceId || !packageId || !date || !timeSlot) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const service = await Service.findById(serviceId);
  if (!service) return res.status(404).json({ error: "Service not found" });

  const selectedPackage = service.packages.id(packageId);
  if (!selectedPackage) return res.status(404).json({ error: "Package not found" });

  const availableSlots = await generateAvailableSlots(service, selectedPackage.duration, date);
  if (!availableSlots.includes(timeSlot)) {
    return res
      .status(400)
      .json({ error: "Time slot either not available or overlaps. Please select another one." });
  }

  const { dayStart, dayEnd } = getDateRange(date);

  const existing = await Appointment.findOne({
    user: req.user._id,
    date: { $gte: dayStart, $lte: dayEnd },
    timeSlot,
    status: { $in: ["pending", "confirmed"] },
  });
  if (existing) return res.status(409).json({ error: "You already have an appointment at this time" });

  // const dateObj = new Date(date);
  // dateObj.setUTCHours(0, 0, 0, 0);
  const tz = 'Asia/Dhaka';
  const dateObj = moment.tz(date, tz).startOf('day').toDate();

  const appointment = new Appointment({
    user: req.user._id,
    service: serviceId,
    packageId,
    date: dateObj,
    timeSlot,
    notes,
    packageDuration: selectedPackage.duration,
  });

  await appointment.save();
  res.status(201).json({ message: "Appointment booked", appointment });
});

// Get available slots for a service on a date
const getAvailableTimeSlots = asyncHandler(async (req, res) => {
  const { serviceId, packageId, date } = req.body;

  if (!serviceId || !packageId || !date) {
    return res
      .status(400)
      .json({ error: "Service ID, package ID, and date are required" });
  }

  const service = await Service.findById(serviceId);
  if (!service) return res.status(404).json({ error: "Service not found" });

  const selectedPackage = service.packages.id(packageId);
  if (!selectedPackage) return res.status(404).json({ error: "Package not found" });

  const slots = await generateAvailableSlots(service, selectedPackage.duration, date);
  res.json({ availableSlots: slots });
});

// Get user's appointments
const getUserAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ user: req.user._id })
    .populate("service")
    .sort({ date: 1 });

  res.json(appointments);
});

// Cancel appointment
const cancelAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) return res.status(404).json({ error: "Appointment not found" });
  if (appointment.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ error: "Not authorized" });
  }

  const now = new Date();
  const apptDate = new Date(appointment.date);
  const diffDays = Math.ceil((apptDate - now) / (1000 * 60 * 60 * 24));

  if (diffDays < 3) {
    return res
      .status(400)
      .json({ error: "Cancellations must be at least 3 days in advance." });
  }

  await appointment.deleteOne();
  res.json({ message: "Appointment cancelled and deleted successfully." });
});

// Get all appointments (admin/staff)
const getAllAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find()
    .populate("user", "name email")
    .populate("service")
    .sort({ date: 1 });

  res.json(appointments);
});

// Update status (admin/staff)
const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const valid = ["pending", "confirmed", "cancelled", "completed"];
  if (!valid.includes(status))
    return res.status(400).json({ error: "Invalid status" });

  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) return res.status(404).json({ error: "Appointment not found" });

  appointment.status = status;
  await appointment.save();
  res.json({ message: `Updated to ${status}`, appointment });
});

// Save Google Calendar Event ID
const saveGoogleEventId = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Authorization check
    if (appointment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    appointment.googleEventId = req.body.googleEventId;
    await appointment.save();

    res.json({ message: 'Google Calendar event ID saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// (Optional) Clear Google Event ID after deletion
const clearGoogleEventId = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    appointment.googleEventId = undefined;
    await appointment.save();

    res.json({ message: 'Google Calendar event ID cleared' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// const isCouponApplicable = (couponTemplateCode, serviceCategory) => {
//   const categoryMap = {
//     GROOM: 'grooming',
//     VET: 'vet',
//     // Add more if needed
//   };

//   const matched = Object.entries(categoryMap).find(
//     ([codePart, category]) =>
//       couponTemplateCode.toUpperCase().includes(codePart) &&
//       serviceCategory.toLowerCase() === category
//   );

//   return Boolean(matched);
// };

const handleCouponChange = asyncHandler(async (req, res) => {
  const { action, userCouponId } = req.body;
  const appointment = await Appointment.findById(req.params.id).populate('service');
  if (!appointment) return res.status(404).json({ error: 'Appointment not found' });

  const couponUsed = appointment.couponUsed;

  let userCoupon = null;
  if (couponUsed) {
    userCoupon = await UserCoupon.findOne({
      _id: couponUsed,
      user: req.user._id,
    }).populate('couponTemplate');
  }

  if (action === 'apply') {
    if (couponUsed)
      return res.status(400).json({ error: 'A coupon is already applied' });

    userCoupon = await UserCoupon.findOne({
      _id: userCouponId,
      user: req.user._id,
    }).populate('couponTemplate');
    if (!userCoupon) return res.status(404).json({ error: 'Coupon not found for user' });

    if (userCoupon.quantity <= 0)
      return res.status(400).json({ error: 'No more uses left for this coupon' });

    // const coupon = userCoupon.couponTemplate;
    // const applicable = isCouponApplicable(coupon.templateCode, appointment.service.category);
    // if (!applicable)
    //   return res.status(400).json({ error: 'This coupon is not valid for the selected service category' });

    appointment.couponUsed = userCoupon._id;
    userCoupon.quantity -= 1;

    await userCoupon.save();
    await appointment.save();
    return res.json({ message: 'Coupon applied successfully', appointment });

  } else if (action === 'remove') {
    if (!couponUsed)
      return res.status(400).json({ error: 'No coupon applied' });

    if (!userCoupon)
      return res.status(400).json({ error: 'Coupon has already been removed from your account' });

    userCoupon.quantity += 1;
    await userCoupon.save();

    appointment.couponUsed = undefined;
    await appointment.save();
    return res.json({ message: 'Coupon removed successfully', appointment });

  } else {
    return res.status(400).json({ error: 'Invalid action' });
  }
});


export {
  bookAppointment,
  getAvailableTimeSlots,
  getUserAppointments,
  cancelAppointment,
  getAllAppointments,
  updateAppointmentStatus,
  saveGoogleEventId,
  clearGoogleEventId,
  handleCouponChange
};
