import express from "express";
const router = express.Router();

import {
  bookAppointment,
  getUserAppointments,
  cancelAppointment,
  getAllAppointments,
  updateAppointmentStatus,
  getAvailableTimeSlots,
  saveGoogleEventId,
  clearGoogleEventId,
  handleCouponChange
} from "../controllers/appointmentController.js";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";

// Book a new appointment (user)
router.post("/book", authenticate, bookAppointment);

// Get logged-in user's appointments
router.get("/myappointments", authenticate, getUserAppointments);

// Cancel a user's own appointment
router.put("/:id/cancel", authenticate, checkId, cancelAppointment);

// Admin: Get all appointments
router.get("/", authenticate, authorizeAdmin, getAllAppointments);

// Admin: Update status of appointment
router.put("/:id/status", authenticate, authorizeAdmin, checkId, updateAppointmentStatus);

// Get available times for a service & package
router.post("/available-times", authenticate, getAvailableTimeSlots);

// Save Google event ID
router.put('/:id/google-event', authenticate, saveGoogleEventId);

// (Optional) Clear Google event ID after deletion
router.put('/:id/clear-google-event', authenticate, clearGoogleEventId);

// Apply or remove coupon for an appointment
router.put('/:id/coupon', authenticate, handleCouponChange);

export default router;
