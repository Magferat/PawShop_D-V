import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import TopNavbar from "./pages/Auth/TopNavbar";


const App = () => {
  return (
    <>
      <ToastContainer />
      {/* <Navigation />
      <main className="py-3">
        <Outlet /> */}

    <TopNavbar />
      <main className="pt-16">
    <Outlet />

      </main>
    </>
  );
};

export default App;
