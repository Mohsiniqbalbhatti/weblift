import { useEffect, useState } from "react";
import { FaCircleUser } from "react-icons/fa6";

import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/AuthUser";
import Loader from "../components/Loader";
import axios from "axios";
import toast from "react-hot-toast";
function Nav2() {
  const { setUser } = useUser();
  const [load, setLaod] = useState(false);

  const [scroll, setScroll] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    setLaod(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}user/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      if (res.data) {
        setUser(null);
        navigate("/");
      }
    } catch (error) {
      console.log("Login Error", error);
      toast.error(error?.response?.data?.message || "Something Went Wrong!");
    } finally {
      setLaod(false);
    }
  };
  return (
    <>
      <nav
        className={`navbar z-3 navbar-expand-lg position-fixed w-100 ${
          scroll ? "nav-bg" : ""
        }`}
      >
        {load && <Loader />}
        <div className="container-fluid px-4">
          <a className="navbar-brand" href="#">
            <img
              src={logo}
              alt="weblift.png"
              className="img-fluid"
              style={{ width: "180px" }}
            />
          </a>
          <ul className="navbar-nav2 ms-auto mb-2 mb-lg-0 justify-content-center align-items-center ">
            <li className="nav-item mx-2 d-md-block d-none">
              <a className="nav-link" href="#">
                FeedBack
              </a>
            </li>
            <li className="nav-item mx-2 d-md-block d-none">
              <a className="nav-link" href="#">
                Need help?
              </a>
            </li>
            <li className="nav-item ms-2 me-4 d-md-block d-none">
              <a className="nav-link" href="#">
                Docs
              </a>
            </li>

            <div className="dropdown ms-auto ms-3 me-2">
              <FaCircleUser
                className="dropdown-toggle d-flex align-items-center fs-2 text-cream"
                type="button"
                id="userDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              ></FaCircleUser>

              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="userDropdown"
              >
                <li>
                  <Link className="dropdown-item" to={"/dashboard"}>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Account Settings
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Your Team
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    Log Out
                  </button>
                </li>
              </ul>
            </div>
          </ul>
        </div>
      </nav>
    </>
  );
}
export default Nav2;
