import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logoutUser } from "../../redux/features/auth/authSlice";
import { useGetCartQuery } from "../../redux/features/cart/cartApiSlice";

const TopNavbar = () => {
  const { userInfo } = useSelector((state) => state.auth);

  // const { cartItems } = useSelector((state) => state.cart);
  // const { cartItems } = useSelector((state) => state.cart);
  const { data: cart, refetch } = useGetCartQuery();
  const cartItems = cart?.cartItems || [];
  
  const dispatch = useDispatch();
  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logoutUser());
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img
            src="../uploads/logo.png"
            alt="PawStore Logo"
            className="h-10 w-15 object-cover"
          />
          <Link to="/" className="text-3xl font-bold text-yellow-800 tracking-wide">
            PawShop
          </Link>
        </div>

        <ul className="flex items-center space-x-6 text-gray-700 font-medium">
          <li>
            <Link to="/">Home</Link>
          </li>

          <li className="relative group">
            <button className="focus:outline-none">Products</button>
            <ul className="absolute top-full right-0 mt-0 min-w-[12rem] bg-white shadow border rounded text-sm hidden group-hover:block z-50">
              {userInfo?.isAdmin ? (
                <>
                  <li><Link to="/admin/allproductslist" className="block px-4 py-2 hover:bg-gray-100">Product List</Link></li>
                  <li><Link to="/admin/orders" className="block px-4 py-2 hover:bg-gray-100">Order List</Link></li>
                  <li><Link to="/admin/allcoupons" className="block px-4 py-2 hover:bg-gray-100">Coupon List</Link></li>
                  <li><Link to="/admin/productlist" className="block px-4 py-2 hover:bg-gray-100">Create Product</Link></li>
                  <li><Link to="/admin/addcoupon" className="block px-4 py-2 hover:bg-gray-100">Create Coupon</Link></li>
                  <li><Link to="/productshop" className="block px-4 py-2 hover:bg-gray-100">Shop Products</Link></li>
                  <li><Link to="/couponshop" className="block px-4 py-2 hover:bg-gray-100">Shop Coupons</Link></li>
                </>
              ) : (
                <>
                  <li><Link to="/productshop" className="block px-4 py-2 hover:bg-gray-100">Shop Products</Link></li>
                </>
              )}
              {userInfo && !userInfo.isAdmin && (
                <>
                  <li><Link to="/my-coupons" className="block px-4 py-2 hover:bg-gray-100">My Coupons</Link></li>
                  <li><Link to="/couponshop" className="block px-4 py-2 hover:bg-gray-100">Shop Coupons</Link></li>
                </>
              )}
            </ul>
          </li>

          <li className="relative group">
            <button className="focus:outline-none">PetShop</button>
            <ul className="absolute top-full right-0 mt-0 min-w-[10rem] bg-white shadow border rounded text-sm hidden group-hover:block z-50">
              <li><Link to="/petshop" className="block px-4 py-2 hover:bg-gray-100">Shop Pets</Link></li>
              {userInfo && !userInfo.isAdmin && (
                <>
                  <li><Link to="/addpet" className="block px-4 py-2 hover:bg-gray-100">Add Pet</Link></li>
                  <li><Link to="/petlist" className="block px-4 py-2 hover:bg-gray-100">My Pets</Link></li>
                </>
              )}
            </ul>
          </li>

          {userInfo?.isAdmin && (
            <>
              <li><Link to="/admin/userlist">Users</Link></li>
              {/* <li><Link to="/services">Services</Link></li> */}

            <li className="relative group">
            <button className="focus:outline-none">Services</button>
            <ul className="absolute top-full right-0 mt-0 min-w-[12rem] bg-white shadow border rounded text-sm hidden group-hover:block z-50">
                  {/* <li><Link to="/services" className="block px-4 py-2 hover:bg-gray-100">Services</Link></li> */}
                  <li><Link to="/admin/allservices" className="block px-4 py-2 hover:bg-gray-100">Services List</Link></li>
                  <li><Link to="/admin/addservice" className="block px-4 py-2 hover:bg-gray-100">Add Service</Link></li>
            </ul>
          </li>
            </>
          )}

          {userInfo && !userInfo.isAdmin && (
            <>
              <li className="relative group">
                <button className="focus:outline-none">Services</button>
                <ul className="absolute top-full right-0 mt-0 min-w-[10rem] bg-white shadow border rounded text-sm hidden group-hover:block z-50">
                  <li><Link to="/services" className="block px-4 py-2 hover:bg-gray-100">Services</Link></li>
                  <li><Link to="/calendar" className="block px-4 py-2 hover:bg-gray-100">My Calendar</Link></li>
                </ul>
              </li>
                {/* <li><Link to="/cart">Cart ({cartItems.reduce((a, c) => a + c.qty, 0)}) */}
                <li><Link to="/cart">Cart ({cartItems.length})
                {/* <li><Link to="/cart">Cart ({cartItems.length}) */}

              </Link></li>
            </>
          )}

          <li>
            <Link to="/about">About Us</Link>
          </li>

          {userInfo ? (
            <li className="relative group">
              <button className="focus:outline-none">{userInfo.username}</button>
              <ul className="absolute top-full right-0 mt-0 min-w-[10rem] bg-white shadow border rounded text-sm hidden group-hover:block z-50">
                <li>
                  <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">
                    View Profile
                  </Link>
                </li>
                <li>
                  <Link to="/my-orders" className="block px-4 py-2 hover:bg-gray-100">
                    My Orders
                  </Link>
                </li>
                <li>
                  <button
                    onClick={logoutHandler}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </li>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default TopNavbar;
