import asyncHandler from "../middlewares/asyncHandler.js";
import Complaint from '../models/complaintModel.js';
import mongoose from 'mongoose';

// Create a new complaint (User only)
const createComplaint = asyncHandler(async (req, res) => {
  const {
    complaintAgainst,
    orderId,
    email,
    typeOfComplaint,
    dateOfIncident,
    description,
  } = req.body;

  const submittedBy = req.user._id; // Automatically use authenticated user

  // Validate required fields
  if (
    !complaintAgainst ||
    !typeOfComplaint ||
    !dateOfIncident ||
    !description ||
    (complaintAgainst === 'product' && !orderId) ||
    (complaintAgainst === 'user' && !email)
  ) {
    res.status(400);
    throw new Error('All required fields must be provided correctly.');
  }

  const complaint = await Complaint.create({
    submittedBy,
    complaintAgainst,
    orderId,
    email,
    typeOfComplaint,
    dateOfIncident,
    description,
  });

  res.status(201).json(complaint);
});


// Filter complaints
const buildComplaintFilter = (query) => {
  const { complaintAgainst, submittedBy } = query;
  const filter = {};

  if (complaintAgainst) {
    filter.complaintAgainst = complaintAgainst;
  }

  if (submittedBy) {
    filter.submittedBy = submittedBy;
  }


  return filter;
};

//Get all complaints (Admin only)
const getAllComplaints = asyncHandler(async (req, res) => {
  try {
    const filter = buildComplaintFilter(req.query);

    const complaints = await Complaint.find(filter)
      .populate('submittedBy', 'username email')
      .limit(10)
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});


// Get complaints of a logged-in user 
const getMyComplaints = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Reuse the same filter builder and enforce the user's own ID
  const filter = buildComplaintFilter(req.query);
  filter.submittedBy = userId;

  const complaints = await Complaint.find(filter)
    .sort({ createdAt: -1 });

  res.status(200).json(complaints);
});



// Delete a complaint (Admin only)
const deleteComplaint = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid complaint ID' });
  }

  const complaint = await Complaint.findById(id);

  if (!complaint) {
    return res.status(404).json({ message: 'Complaint not found' });
  }

  await complaint.deleteOne();
  res.status(200).json({ message: 'Complaint deleted successfully' });
});

// Get single complaint details (Admin only)
const getComplaintById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid complaint ID' });
  }

  const complaint = await Complaint.findById(id).populate('submittedBy', 'username email');

  if (!complaint) {
    return res.status(404).json({ message: 'Complaint not found' });
  }

  res.status(200).json(complaint);
});

export {
  createComplaint,
  getAllComplaints,
  getMyComplaints,
  getComplaintById,
  deleteComplaint,
};
