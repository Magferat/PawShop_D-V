import express from "express";
import formidable from "express-formidable";
const router = express.Router();

// Controllers
import {
  addPet,
  updatePetDetails,
  removePet,
  fetchPetById,
  fetchAllPets,
  fetchNewPets,
  filterPets,
} from "../controllers/petController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";

  router
  .route("/addpet")
  .post(authenticate, formidable(), addPet); 


router.route("/petlist").get(fetchAllPets);


router.get("/new", fetchNewPets);


router
  .route("/:id")
  .get(checkId, authenticate, fetchPetById) 
  .put(checkId, authenticate, formidable(), updatePetDetails) 
  .delete(checkId, authenticate, removePet); 


router.route("/filtered-pets").post(filterPets);

export default router;
