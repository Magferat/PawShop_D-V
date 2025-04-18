import express from "express";
import {
    createRequest,
    getIncomingRequests,
    getOutgoingRequests,
    updateRequestStatus,
    deleteRequest,      
} from "../controllers/petrequestController.js";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";

const router = express.Router();

// router.route("/requests")
//   .post(authenticate, createRequest) // Send a request

router.route("/incoming")
  .get(authenticate, getIncomingRequests) // Owner's view

router.route("/outgoing")
  .get(authenticate, getOutgoingRequests) // Requester's view

router.route("/:id")
  .post(authenticate, checkId, createRequest) // Send a request
  .put(authenticate, checkId, updateRequestStatus) // Accept or reject
  .delete(authenticate, checkId, deleteRequest); // Remove (by requester)

export default router;