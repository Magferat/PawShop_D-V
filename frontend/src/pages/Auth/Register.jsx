

import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { useRegisterMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";

const Register = () => {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await register({ username, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
        toast.success("Welcome to the Paw Family! 🐾");
      } catch (err) {
        toast.error(err?.data?.message || "Registration failed.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-100 to-pink-200">
      <section className="flex flex-wrap shadow-2xl rounded-3xl bg-white overflow-hidden">
        <div className="p-12 w-full md:w-[35rem]">
          <h1 className="text-3xl font-bold text-pink-600 mb-4 flex items-center gap-2">
            🐶 Create an Account
          </h1>
          <p className="text-gray-500 mb-6">
            Join our pet-loving community today! 🐾
          </p>

          <form onSubmit={submitHandler} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                className="mt-1 p-3 border border-pink-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 p-3 border border-pink-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="mt-1 p-3 border border-pink-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="mt-1 p-3 border border-pink-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 w-full"
            >
              {isLoading ? "Registering..." : "Register 🐾"}
            </button>

            {isLoading && <Loader />}
          </form>

          <div className="mt-6 text-sm text-center text-gray-600">
            Already part of the pack?{" "}
            <Link
              to={redirect ? `/login?redirect=${redirect}` : "/login"}
              className="text-pink-500 hover:underline font-medium"
            >
              Log in here 🐕
            </Link>
          </div>
        </div>

        <img
          src="https://images.unsplash.com/photo-1576502200916-3808e07386a5?auto=format&fit=crop&w=1000&q=80"
          alt="Cute pets"
          className="hidden md:block md:w-[30rem] object-cover"
        />
      </section>
    </div>
  );
};

export default Register;
