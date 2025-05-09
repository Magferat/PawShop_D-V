import asyncHandler from "../middlewares/asyncHandler.js";
import bcrypt from "bcryptjs";
import createToken from "../utils/createToken.js";
//
import User from "../models/userModel.js";
import Pet from "../models/petModel.js"; 
import Complaint from '../models/complaintModel.js';
import Coupon from '../models/couponModel.js';
import Order from "../models/orderModel.js";
import Request from "../models/petrequestModel.js";
import Appointment from "../models/appointmentModel.js";

const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please fill all the inputs.");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = new User({ username, email, password: hashedPassword });

  await newUser.save();
  createToken(res, newUser._id);

  res.status(201).json({
    _id: newUser._id,
    username: newUser.username,
    email: newUser.email,
    isAdmin: newUser.isAdmin,
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (isPasswordValid) {
      createToken(res, existingUser._id);

      return res.status(200).json({
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        isAdmin: existingUser.isAdmin,
        image: existingUser.image,
      });
    }
  }

  res.status(401);
  throw new Error("Invalid email or password");
});

const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out successfully" });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      image: user.image,
    });
  } else {
    res.status(404);
    throw new Error("User not found.");
  }
});

const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    if (req.body.email) {
      const existingEmail = await User.findOne({ email: req.body.email });
      if (existingEmail && existingEmail._id.toString() !== user._id.toString()) {
        res.status(400);
        throw new Error("Email already in use");
      }
      user.email = req.body.email;
    }

    user.username = req.body.username || user.username;
    user.image = req.body.image || user.image || "" // Update image if provided

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      user.password = hashedPassword;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      image: updatedUser.image,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found.");
  }

  if (user.isAdmin) {
    res.status(400);
    throw new Error("Cannot delete admin user");
  }

  // Delete related documents
  await Promise.all([
    Pet.deleteMany({ ownerId: user._id }),
    Complaint.deleteMany({ submittedBy: user._id }),
    Coupon.deleteMany({ user: user._id }),
    Order.deleteMany({ user: user._id }),
    Request.deleteMany({ requester: user._id }),
    Appointment.deleteMany({ user: user._id })
  ]);

  // Delete the user
  await User.deleteOne({ _id: user._id });

  res.json({ message: "User and all related data removed successfully." });
});


const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const getPublicUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("username image email reviews rating numReviews");

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const addUserReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const user = await User.findById(req.params.id);

  if (user) {
    const alreadyReviewed = user.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("You have already reviewed this user");
    }

    const review = {
      name: req.user.username,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    user.reviews.push(review);
    user.numReviews = user.reviews.length;

    user.rating =
      user.reviews.reduce((acc, item) => item.rating + acc, 0) / user.reviews.length;

    await user.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const deleteUserReview = asyncHandler(async (req, res) => {
  const { id: userId, reviewId } = req.params;
  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const review = user.reviews.find(
    (r) => r._id.toString() === reviewId && r.user.toString() === req.user._id.toString()
  );

  if (!review) {
    res.status(404);
    throw new Error("Review not found or not authorized to delete this review");
  }

  user.reviews = user.reviews.filter((r) => r._id.toString() !== reviewId);
  user.numReviews = user.reviews.length;

  user.rating =
    user.reviews.length > 0
      ? user.reviews.reduce((acc, r) => acc + r.rating, 0) / user.reviews.length
      : 0;

  await user.save();
  res.status(200).json({ message: "Review removed" });
});

// const updateUserById = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.params.id);

//   if (user) {
//     if (req.body.email) {
//       const existingEmail = await User.findOne({ email: req.body.email });
//       if (existingEmail && existingEmail._id.toString() !== user._id.toString()) {
//         res.status(400);
//         throw new Error("Email already in use");
//       }
//       user.email = req.body.email;
//     }

//     user.username = req.body.username || user.username;

//     if (req.body.isAdmin !== undefined) {
//       user.isAdmin = req.body.isAdmin;
//     }

//     const updatedUser = await user.save();

//     res.json({
//       _id: updatedUser._id,
//       username: updatedUser.username,
//       email: updatedUser.email,
//       isAdmin: updatedUser.isAdmin,
//     });
//   } else {
//     res.status(404);
//     throw new Error("User not found");
//   }
// });

export {
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
  deleteUserReview,
};
