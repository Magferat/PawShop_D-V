import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";

const TopNavbar = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div>
          <Link to="/" className="text-xl font-semibold text-gray-800">
            PetStore
          </Link>
        </div>

        {/* Navigation Links */}
        <ul className="flex items-center space-x-6 text-gray-700 font-medium">
          <li>
            <Link to="/">Home</Link>
          </li>

          {/* Products Dropdown */}
          <li className="relative group">
            <button className="focus:outline-none">Products</button>
            <ul className="absolute top-full mt-0 w-48 bg-white shadow border rounded text-sm hidden group-hover:block z-50">
              {userInfo?.isAdmin ? (
                <>
                  <li>
                    <Link to="/admin/allproductslist" className="block px-4 py-2 hover:bg-gray-100">
                      Product List
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/allcouponslist" className="block px-4 py-2 hover:bg-gray-100">
                      Coupon List
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/productlist" className="block px-4 py-2 hover:bg-gray-100">
                      Create Product
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/createcoupon" className="block px-4 py-2 hover:bg-gray-100">
                      Create Coupon
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/productshop" className="block px-4 py-2 hover:bg-gray-100">
                      Shop Products
                    </Link>
                  </li>
                  <li>
                    <Link to="/coupons" className="block px-4 py-2 hover:bg-gray-100">
                      Shop Coupons
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </li>

        
          <li className="relative group">
              <button className="focus:outline-none">PetShop</button>
              <ul className="absolute top-full mt-0 w-40 bg-white shadow border rounded text-sm hidden group-hover:block z-50">
                <li>
                  <Link
                    to="/petshop"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Shop Pets
                  </Link>
                </li>

                {userInfo && !userInfo.isAdmin && (
                    <li>
                        <Link
                        to="/addpet"
                        className="block px-4 py-2 hover:bg-gray-100"
                        >
                        Add pet
                        </Link>
                    </li>
           
                )}

                {userInfo && !userInfo.isAdmin && (
                    <li>
                        <Link
                        to="/petlist"
                        className="block px-4 py-2 hover:bg-gray-100"
                        >
                        My Pets
                        </Link>
                    </li>
           
            )}

              </ul>
            </li>

          {userInfo?.isAdmin && (
            <li>
              <Link to="/admin/userlist">Users</Link>
            </li>
          )}

          {userInfo && !userInfo.isAdmin && (
            <li>
              <Link to="/bookings">Bookings</Link>
            </li>
          )}

            {userInfo && !userInfo.isAdmin && (
            <li>
              <Link to="/cart">Cart ({cartItems.reduce((a, c) => a + c.qty, 0)})</Link>
            </li>
          )}

          <li>
            <Link to="/about">About Us</Link>
          </li>

          {/* Profile Dropdown */}
          {userInfo ? (
            <li className="relative group">
              <button className="focus:outline-none">{userInfo.username}</button>
              <ul className="absolute top-full mt-0 w-40 bg-white shadow border rounded text-sm hidden group-hover:block z-50">
                <li>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    View Profile
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
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default TopNavbar;
