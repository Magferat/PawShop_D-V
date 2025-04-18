import asyncHandler from "express-async-handler";
import Pet from "../models/petModel.js"; 
import Request from "../models/petrequestModel.js";

// Mapping lowercase pet status to request type
const typeMap = {
  forsale: "For Sale",
  adoption: "Adoptable",
  foster: "Foster",
};

// POST /api/requests/:id
const createRequest = asyncHandler(async (req, res) => {
  const petId = req.params.id;
  const pet = await Pet.findById(petId);

  if (!pet) {
    res.status(404);
    throw new Error("Pet not found");
  }

  if (pet.ownerId._id.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error("You cannot request your own pet");
  }

  const existing = await Request.findOne({
    pet: pet._id,
    requester: req.user._id,
  });

  if (existing) {
    res.status(400);
    throw new Error("Request already sent for this pet");
  }

  const formattedType = typeMap[pet.status?.toLowerCase()];

  if (!formattedType) {
    res.status(400);
    throw new Error("Invalid request type from pet");
  }

  const request = new Request({
    pet: pet._id,
    owner: pet.ownerId._id,
    requester: req.user._id,
    type: formattedType,
    status: "pending",
  });

  const created = await request.save();
  res.status(201).json(created);
});

// GET /api/requests/incoming?status=pending
const getIncomingRequests = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = { owner: req.user._id };
  if (status) filter.status = status;

  const requests = await Request.find(filter)
    .populate("pet", "name image")
    .populate("requester", "username email");

  res.json(requests);
});

// GET /api/requests/outgoing?status=pending
const getOutgoingRequests = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = { requester: req.user._id };
  if (status) filter.status = status;

  const requests = await Request.find(filter)
    .populate("pet", "name image species location")
    .populate("owner", "username email");

  res.json(requests);
});

// PUT /api/requests/:id
const updateRequestStatus = asyncHandler(async (req, res) => {
  const { status } = req.body; // "accepted" or "rejected"

  if (!["accepted", "rejected"].includes(status)) {
    res.status(400);
    throw new Error("Invalid status value");
  }

  const request = await Request.findById(req.params.id);

  if (!request) {
    res.status(404);
    throw new Error("Request not found");
  }

  if (request.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to update this request");
  }

  request.status = status;
  await request.save();

  res.json({ message: `Request ${status}` });
});

// DELETE /api/requests/:id
const deleteRequest = asyncHandler(async (req, res) => {
  const request = await Request.findById(req.params.id);

  if (!request) {
    res.status(404);
    throw new Error("Request not found");
  }

  // Only requester can delete the request
  if (request.requester.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to delete this request");
  }

  // Only allow deletion if the request is still pending
  if (request.status !== "pending") {
    res.status(400);
    throw new Error("Only pending requests can be deleted");
  }

  await request.remove();
  res.json({ message: "Pending request successfully removed" });
});


export {
  createRequest,
  getIncomingRequests,
  getOutgoingRequests,
  updateRequestStatus,
  deleteRequest,
};
