import asyncHandler from "../middlewares/asyncHandler.js";
import Service from "../models/serviceModel.js";

// Get all services
const getAllServices = asyncHandler(async (req, res) => {
  const services = await Service.find({});
  res.json(services);
});

// Get single service by ID
const getServiceById = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    res.status(404);
    throw new Error("Service not found");
  }
  res.json(service);
});

// Create a new service (admin only)
const createService = asyncHandler(async (req, res) => {
  const {
    name,
    address,
    email,
    phone,
    category,
    description,
    workingHours,
    packages,
  } = req.body;

  if (!name || !category || !workingHours?.start || !workingHours?.end) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const exists = await Service.findOne({ name });
  if (exists) {
    return res.status(409).json({ error: "Service with this name already exists" });
  }

  const service = new Service({
    name,
    address,
    email,
    phone,
    category,
    description,
    workingHours,
    packages: packages || [],
  });

  await service.save();
  res.status(201).json(service);
});

// Update service (admin only)
const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    return res.status(404).json({ error: "Service not found" });
  }

  const {
    name,
    address,
    email,
    phone,
    category,
    description,
    workingHours,
  } = req.body;

  service.name = name ?? service.name;
  service.address = address ?? service.address;
  service.email = email ?? service.email;
  service.phone = phone ?? service.phone;
  service.category = category ?? service.category;
  service.description = description ?? service.description;
  service.workingHours = workingHours ?? service.workingHours;

  await service.save();
  res.json(service);
});

// Delete service (admin only)
const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    return res.status(404).json({ error: "Service not found" });
  }

  await service.deleteOne();
  res.json({ message: "Service removed" });
});

// Add a package to a service (admin only)
const addPackage = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    return res.status(404).json({ error: "Service not found" });
  }

  const { name, petType, description, duration, price } = req.body;

  if (!name || !petType || !duration || !price) {
    return res.status(400).json({ error: "Missing required package fields" });
  }

  const newPackage = {
    name,
    petType,
    description,
    duration,
    price,
  };

  service.packages.push(newPackage);
  await service.save();

  res.status(201).json(service);
});

// Update a package within a service (admin only)
const updatePackage = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    return res.status(404).json({ error: "Service not found" });
  }

  const packageToUpdate = service.packages.id(req.params.packageId);
  if (!packageToUpdate) {
    return res.status(404).json({ error: "Package not found" });
  }

  const { name, petType, description, duration, price } = req.body;

  packageToUpdate.name = name ?? packageToUpdate.name;
  packageToUpdate.petType = petType ?? packageToUpdate.petType;
  packageToUpdate.description = description ?? packageToUpdate.description;
  packageToUpdate.duration = duration ?? packageToUpdate.duration;
  packageToUpdate.price = price ?? packageToUpdate.price;

  await service.save();
  res.json(service);
});

// Delete a package within a service (admin only)
const deletePackage = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    return res.status(404).json({ error: "Service not found" });
  }

  const packageToDelete = service.packages.id(req.params.packageId);
  if (!packageToDelete) {
    return res.status(404).json({ error: "Package not found" });
  }

  packageToDelete.deleteOne();
  await service.save();
  res.json({ message: "Package removed", service });
});

// Get a single package by ID (for editing purposes)
const getPackageById = asyncHandler(async (req, res) => {
  const { serviceId, packageId } = req.params;

  const service = await Service.findById(serviceId);
  if (!service) {
    return res.status(404).json({ error: "Service not found" });
  }

  const packageData = service.packages.id(packageId); // Find the package by ID
  if (!packageData) {
    return res.status(404).json({ error: "Package not found" });
  }

  res.json(packageData);
});

export {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  addPackage,
  updatePackage,
  deletePackage,
  getPackageById,
};
