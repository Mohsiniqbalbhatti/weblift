import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Toaster } from "react-hot-toast";
import Footer from "../components/Footer";

function Guest() {
  return (
    <>
      <div className="container-fluid">
        <Navbar />
        <Outlet />
        <Footer />
        <div className="stars"></div>
        <Toaster />
      </div>
    </>
  );
}
export default Guest;
