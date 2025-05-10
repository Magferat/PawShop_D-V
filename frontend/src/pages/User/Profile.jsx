import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import Loader from "../../components/Loader";
import UserMenu from "./UserMenu";
import { useProfileMutation, useUploadImageMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";

const Profile = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);
  const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();
  const [uploadImage, { isLoading: loadingImageUpload }] = useUploadImageMutation();

  const dispatch = useDispatch();

  useEffect(() => {
    console.log("User Image:", userInfo)
    setUserName(userInfo.username);
    setEmail(userInfo.email);
    setImage(userInfo.image || "");
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Both password fields are required");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await updateProfile({
        _id: userInfo._id,
        username,
        email,
        password,
        image, // send image URL
      }).unwrap();

      dispatch(setCredentials({ ...res }));
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };



  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsigned_pets"); // your unsigned preset

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dtzk3edsz/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log(data); // You can check what it returns!

      if (data.secure_url) {
        setImage(data.secure_url); // store the Cloudinary image URL
        toast.success("Image uploaded");
      } else {
        toast.error("Cloudinary upload failed");
      }
    } catch (err) {
      console.error("Cloudinary upload error", err);
      toast.error("Image upload failed");
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gradient-to-br from-rose-100 to-pink-200 px-4 py-10">
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl">
        {/* Left - User Menu */}
        <div className="md:w-1/3">
          <UserMenu />
        </div>

        {/* Right - Profile Form */}
        <div className="bg-white shadow-2xl rounded-2xl p-8 w-full md:w-2/3">
          <h2 className="text-3xl font-bold text-pink-600 mb-6 text-center">
            🛠️ Update Profile
          </h2>

          <form onSubmit={submitHandler} className="space-y-5">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Image
              </label>
              {image && (
                <img
                  src={image}
                  alt="Profile Preview"
                  className="h-24 w-24 object-cover rounded-full mb-2"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={uploadFileHandler}
                className="block w-full text-sm text-gray-700 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:bg-pink-100 file:text-pink-700 hover:file:bg-pink-200"
              />
              {uploading && <Loader />}
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter name"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter email"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm password"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-between gap-4 pt-2">
              <button
                type="submit"
                className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-6 rounded-lg font-semibold transition duration-200 w-full"
              >
                Update
              </button>
              <Link
                to="/my-orders"
                className="bg-pink-600 hover:bg-pink-700 text-white py-2 px-6 rounded-lg text-center font-semibold transition duration-200 w-full"
              >
                My Orders
              </Link>
            </div>

            {loadingUpdateProfile && <Loader />}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
