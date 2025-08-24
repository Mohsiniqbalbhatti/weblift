import { Toaster } from "react-hot-toast";
import { useUser } from "./context/AuthUser";
import { Outlet, useNavigate } from "react-router-dom";
import Loader from "./components/Loader";
import Footer from "./components/Footer";
import Nav2 from "./pages/Nav2";
import { useEffect } from "react";
function App() {
  const { user, load } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if we're not loading and have no user
    if (!load && !user) {
      navigate("/", { replace: true });
    }
  }, [load, user, navigate]);

  if (load) {
    return <Loader />;
  }

  // Don't render the app if there's no user
  if (!user) {
    return null;
  }

  return (
    <div className="container-fluid">
      <Nav2 />
      <Outlet />

      {/* background */}
      <div className="stars"></div>

      <Toaster />
      <Footer />
    </div>
  );
}
export default App;
