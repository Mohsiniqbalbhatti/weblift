import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useUser } from "./context/AuthUser";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Nav2 from "./pages/Nav2";
function App() {
  const { user, load } = useUser();
  if (load) {
    return <Loader />;
  }
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!load && user) {
      if (
        location.pathname === "/" ||
        location.pathname === "/login" ||
        location.pathname === "/signup"
      ) {
        navigate("/dashboard");
      } else {
        console.log(location.pathname);
        navigate(location.pathname);
      }
    }
  }, [user, load, navigate]);

  return (
    <div className="container-fluid">
      {user ? (
        <>
          <Nav2 />
          <Outlet />
        </>
      ) : (
        <>
          {" "}
          <Navbar />
          <Outlet />
          {/* <Loader />{" "} */}
        </>
      )}
      {/* background */}
      <div className="stars"></div>

      <Toaster />
      <Footer />
    </div>
  );
}
export default App;
