import { Toaster } from "react-hot-toast";
import { useUser } from "./context/AuthUser";
import { useNavigate, Outlet } from "react-router-dom";
import Loader from "./components/Loader";
import Footer from "./components/Footer";
import Nav2 from "./pages/Nav2";
function App() {
  const { user, load } = useUser();
  if (load) {
    return <Loader />;
  }

  const navigate = useNavigate();
  if (!user) {
    navigate("/");
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
