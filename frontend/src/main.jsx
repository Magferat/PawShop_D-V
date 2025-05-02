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

import Cart from "./pages/Cart/cart.jsx";
import Shipping from "./pages/Cart/Shipping.jsx";
import PlaceOrder from "./pages/Cart/PlaceOrder.jsx";
import MyOrders from "./pages/Cart/MyOrders.jsx";
import OrderDetails from "./pages/Cart/OrderDetails.jsx";

import ServicesPage from "./pages/Services/Services.jsx";
import ServiceDetailPage from "./pages/Services/ServiceDetail.jsx";
import CalendarPage from "./pages/Services/Bookingcalender.jsx";
import AppointmentDetailsPage from "./pages/Services/BookingDetails.jsx";
import AllServicesPage from "./pages/Admin/AllServices.jsx";
import EditServicePage from "./pages/Admin/EditService.jsx";
import EditPackagePage from "./pages/Admin/EditPackage.jsx";
import AddPackagePage from "./pages/Admin/AddPackage.jsx";
import AddServicePage from "./pages/Admin/AddService.jsx";

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
        <Route path="/cart" element={<Cart />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/orders/:id" element={<OrderDetails />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:serviceId" element={<ServiceDetailPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/appointments/:id" element={<AppointmentDetailsPage />} />

      
      </Route>

      <Route path="/admin" element={<AdminRoute />}>
        <Route path="categorylist" element={<CategoryList />} />
        <Route path="productlist" element={<ProductList />} />
        <Route path="allproductslist" element={<AllProducts />} />
        <Route path="productlist/:pageNumber" element={<ProductList />} />
        <Route path="product/update/:_id" element={<ProductUpdate />} />
        <Route path="addcoupon" element={<AddCoupon />} />
        <Route path="allcoupons" element={<AllCouponsAdmin />} />
        <Route path="allservices" element={<AllServicesPage />} />
        <Route path="editservice/:id" element={<EditServicePage />} />
        <Route path=":serviceId/editpackage/:packageId" element={<EditPackagePage />} />
        <Route path=":serviceId/addpackage" element={<AddPackagePage />} />
        <Route path="addservice" element={<AddServicePage />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
      <RouterProvider router={router} />
  </Provider>
);
