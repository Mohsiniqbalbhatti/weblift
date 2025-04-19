import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../Guest/Home";
import Login from "../Guest/Login";
import Signup from "../Guest/Signup";
import ProjectSetting from "../pages/ProjectSetting";
import Dashboard from "../pages/Dashboard";
import Contact from "../pages/Contact";
import CreateProject from "../pages/CreateProject";
import Deployement from "../pages/Deployement";
import Guest from "../Guest/Guest";
import UserProfile from "../pages/UserProfile";
import QuickGuide from "../pages/QuickGuide";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Guest />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      { path: "/contact", element: <Contact /> },
      { path: "/docs", element: <QuickGuide /> },
    ],
  },
  {
    path: "", // This route should handle authenticated users
    element: <App />,
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/project/:projectId", element: <ProjectSetting /> },
      {
        path: "/deployment/:deploymentId",
        element: <Deployement />,
      },
      { path: "/createProject/githubRepo", element: <CreateProject /> },
      { path: "/profile", element: <UserProfile /> },
    ],
  },
]);

export default router;
