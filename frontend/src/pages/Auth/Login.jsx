


import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { useLoginMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

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
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-100 to-pink-200">
      <section className="flex flex-wrap shadow-2xl rounded-3xl bg-white overflow-hidden">
        <div className="p-12 w-full md:w-[35rem]">
          <h1 className="text-3xl font-bold text-pink-600 mb-4 flex items-center gap-2">
            🐾 Welcome Back!
          </h1>
          <p className="text-gray-500 mb-6">
            Sign in to your pet-tastic account 🐶🐱
          </p>

          <form onSubmit={submitHandler} className="space-y-6">
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
                className="text-black mt-1 p-3 border border-pink-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 w-full"
            >
              {isLoading ? "Signing In..." : "Sign In 🐾"}
            </button>

            {isLoading && <Loader />}
          </form>

          <div className="mt-6 text-sm text-center text-gray-600">
            New to PawShop?{" "}
            <Link
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
              className="text-pink-500 hover:underline font-medium"
            >
              Register Here 🐾
            </Link>
          </div>
        </div>

        <img
          src="https://patch.com/img/cdn20/shutterstock/22871539/20210317/120803/styles/patch_image/public/shutterstock-260124632___17114947878.jpg"
          alt="Cute pet shop"
          className="hidden md:block md:w-[30rem] object-cover"
        />
      </section>
    </div>
  );
};

export default Login;
