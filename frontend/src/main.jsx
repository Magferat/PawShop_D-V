import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./redux/store";
import { Route, RouterProvider, createRoutesFromElements } from "react-router";
import { createBrowserRouter } from "react-router-dom";

import PrivateRoute from "./components/PrivateRoute";

// Auth
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

import AdminRoute from "./pages/Admin/AdminRoute";
import Profile from "./pages/User/Profile";


import CategoryList from "./pages/Admin/CategoryList";

import ProductList from "./pages/Admin/ProductList";
import AllProducts from "./pages/Admin/AllProducts";
import ProductUpdate from "./pages/Admin/ProductUpdate";

import Home from "./pages/Home.jsx";

import ProductDetails from "./pages/Products/ProductDetails.jsx";

import Shop from "./pages/Products/Shop.jsx";

import Petshop from "./pages/Pets/Petshop.jsx";
import AddPet from "./pages/Pets/Addpet.jsx"; 
import PetDetails from "./pages/Pets/PetDetails.jsx";
import EditPet from "./pages/Pets/EditPet.jsx"; 
import PetList from "./pages/Pets/PetList.jsx"; 

import OwnerDetails from "./pages/Pets/PetOwner.jsx";

import AddCoupon from "./pages/Coupons/AddCoupon.jsx";
import ShopCoupons from "./pages/Coupons/ShopCoupons.jsx";
import MyCoupons from "./pages/Coupons/MyCoupons.jsx";
import AllCouponsAdmin from "./pages/Coupons/AllCoupons.jsx";

import OutgoingRequests from "./pages/User/OutgoingRequests.jsx";
import IncomingRequests from "./pages/User/IncomingRequests.jsx";


//These are all frontend routes
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route index={true} path="/" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/productshop" element={<Shop />} />
      <Route path="/petshop" element={<Petshop />} />
      

      {/* Registered users */}
      <Route path="" element={<PrivateRoute />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/addpet" element={<AddPet />} />
        <Route path="/pet/:id" element={<PetDetails />} />
        <Route path="/pets/edit/:id" element={<EditPet />} />
        <Route path="/petlist" element={<PetList />} />
        <Route path="/owner/:id" element={<OwnerDetails />} />
        <Route path="/couponshop" element={<ShopCoupons />} />
        <Route path="/my-coupons" element={<MyCoupons />} />
        <Route path="/profile/outgoing-requests" element={<OutgoingRequests />} />
        <Route path="/profile/incoming-requests" element={<IncomingRequests />} />

      
      </Route>

      <Route path="/admin" element={<AdminRoute />}>
        <Route path="categorylist" element={<CategoryList />} />
        <Route path="productlist" element={<ProductList />} />
        <Route path="allproductslist" element={<AllProducts />} />
        <Route path="productlist/:pageNumber" element={<ProductList />} />
        <Route path="product/update/:_id" element={<ProductUpdate />} />
        <Route path="addcoupon" element={<AddCoupon />} />
        <Route path="allcoupons" element={<AllCouponsAdmin />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
      <RouterProvider router={router} />
  </Provider>
);
