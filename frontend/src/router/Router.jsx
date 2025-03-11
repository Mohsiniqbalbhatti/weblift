import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../Guest/Home";
import Login from "../Guest/Login";
import Signup from "../Guest/Signup";
import ProjectSetting from "../pages/ProjectSetting";
import Dashboard from "../pages/Dashboard";
import Contact from "../pages/Contact";
import { UserExist } from "./ProtectedRoute";
import CreateProject from "../pages/CreateProject";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      { path: "/contact", element: <Contact /> },
      {
        element: <UserExist />,
        children: [
          { path: "/dashboard", element: <Dashboard /> },
          { path: "/project/:projectId", element: <ProjectSetting /> },
          { path: "/createProject/githubRepo", element: <CreateProject /> },
        ],
      },
    ],
  },
]);
export default router;
