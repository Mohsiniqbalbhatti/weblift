import Navbar from "./components/Navbar";
import Signup from "./pages/Signup";
import { Toaster } from "react-hot-toast";
function App() {
  return (
    <div className="container-fluid">
      <Navbar />
      <Signup />
      <Toaster />
    </div>
  );
}
export default App;
