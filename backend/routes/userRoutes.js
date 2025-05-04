import express from "express";
import {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  // updateUserById,
  addUserReview,
  getPublicUserProfile,
  deleteUserReview
} from "../controllers/userController.js";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";

const router = express.Router();

router
  .route("/")
  .post(createUser)
  .get(authenticate, authorizeAdmin, getAllUsers);

router.post("/auth", loginUser);
router.post("/logout", logoutCurrentUser);

router
  .route("/profile")
  .get(authenticate, getCurrentUserProfile)
  .put(authenticate, updateCurrentUserProfile);

// ADMIN ROUTES 👇
router
  .route("/:id")
  .delete(authenticate, authorizeAdmin, deleteUserById)
  .get(authenticate, authorizeAdmin, getUserById)             
  // .put(authenticate, authorizeAdmin, updateUserById);


//viewing pet owner profile and reviewing them
router.route("/:id/reviews").post(authenticate, checkId, addUserReview);
router.route("/:id/reviews").get(authenticate, checkId, getPublicUserProfile);

router
  .route("/:id/reviews/:reviewId")
  .delete(authenticate, checkId, deleteUserReview);


export default router;
