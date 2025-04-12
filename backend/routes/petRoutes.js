import express from "express";
import formidable from "express-formidable";
const router = express.Router();

// Controllers
import {
  addPet,
  updatePetDetails,
  removePet,
  fetchPets,
  fetchPetById,
  fetchAllPets,
  fetchNewPets,
  filterPets,
} from "../controllers/petController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";

// Route to fetch all pets or add a new pet
router
  .route("/petshop")
  .get(fetchPets) // GET all pets with pagination and search functionality

  router
  .route("/addpet")
  .post(authenticate, formidable(), addPet); // POST to add a new pet (any authenticated user)

// Route to fetch all pets (admin only)
router.route("/petlist").get(fetchAllPets);

// Route to fetch newly added pets
router.get("/new", fetchNewPets);

// Routes for specific pet by ID, update, and delete (only for the user who uploaded the pet)
router
  .route("/:id")
  .get(fetchPetById) // GET a specific pet by ID
  .put(authenticate, formidable(), updatePetDetails) // PUT to update pet details (only the pet's owner)
  .delete(authenticate, removePet); // DELETE to remove a pet listing (only the pet's owner)

// Route to filter pets based on status, price, etc.
router.route("/filtered-pets").post(filterPets);

export default router;
