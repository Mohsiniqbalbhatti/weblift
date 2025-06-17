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
    if (!user && !load) {
      navigate("/", { replace: true });
    }
  }, [load, user, navigate]);

  if (load) {
    return <Loader />;
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
