import express from "express";
const router = express.Router();

import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  addPackage,
  updatePackage,
  deletePackage,
  getPackageById,
} from "../controllers/serviceController.js";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";

// Public: fetch all services
router.get("/", getAllServices);

// Public: fetch a specific service by ID
router.get("/:id", checkId, getServiceById);

// Admin-only: create a new service
router.post("/", authenticate, authorizeAdmin, createService);

// Admin-only: update a service
router.put("/:id", authenticate, authorizeAdmin, checkId, updateService);

// Admin-only: delete a service
router.delete("/:id", authenticate, authorizeAdmin, checkId, deleteService);

// Admin-only: add a package to a service
router.post("/:id/packages", authenticate, authorizeAdmin, checkId, addPackage);

// Admin-only: update a package within a service
router.put("/:id/packages/:packageId", authenticate, authorizeAdmin, checkId, updatePackage);

// Admin-only: delete a package within a service
router.delete("/:id/packages/:packageId", authenticate, authorizeAdmin, checkId, deletePackage);

// Admin: get a specific package by ID
router.get("/:serviceId/packages/:packageId", authenticate, authorizeAdmin, getPackageById);

export default router;
