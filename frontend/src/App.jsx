import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import TopNavbar from "./pages/Auth/TopNavbar";

//root layout component for all routes
const App = () => {
  return (
    <>
    {/* shows notifications */}
    <ToastContainer />

    <TopNavbar />
      <main className="pt-16">
    <Outlet />

      </main>
    </>
  );
};

export default App;
