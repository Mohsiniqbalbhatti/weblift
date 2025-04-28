import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Toaster } from "react-hot-toast";
import Footer from "../components/Footer";
import { useUser } from "../context/AuthUser";
import Nav2 from "../pages/Nav2";

function Guest() {
  const { user, load } = useUser();
  return (
    <>
      <div className="container-fluid">
        {user ? <Nav2 /> : <Navbar />}
        <Outlet />
        <Footer />
        <div className="stars"></div>
        <Toaster />
      </div>
    </>
  );
}
export default Guest;
