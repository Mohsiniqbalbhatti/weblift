import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { Link as RouterLink } from "react-router-dom"; // ✅ Renamed react-router-dom Link
import { Link as ScrollLink } from "react-scroll"; // ✅ Renamed react-scroll Link

function Navbar() {
  const [scroll, setScroll] = useState(false);

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

  return (
    <>
      <nav
        className={`navbar z-3 navbar-expand-lg position-fixed w-100 ${
          scroll ? "nav-bg" : ""
        }`}
      >
        <div className="container-fluid px-4">
          <a className="navbar-brand" href="#">
            <img
              src={logo}
              alt="weblift.png"
              className="img-fluid"
              style={{ width: "180px" }}
            />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0 d-flex justify-content-center align-items-center">
              <li className="nav-item">
                <RouterLink
                  className="nav-link active"
                  aria-current="page"
                  to="/"
                >
                  Home
                </RouterLink>
              </li>
              <li className="nav-item">
                <ScrollLink
                  className="nav-link"
                  to="features"
                  smooth={true}
                  duration={300}
                >
                  Features
                </ScrollLink>
              </li>
              <li className="nav-item">
                <RouterLink className="nav-link" to="/docs">
                  Quick Guide
                </RouterLink>
              </li>
              <li className="nav-item">
                <ScrollLink
                  className="nav-link"
                  to="faq"
                  smooth={true}
                  duration={300}
                >
                  FAQs
                </ScrollLink>
              </li>
              <li className="nav-item">
                <RouterLink className="nav-link" to="/contact">
                  Contact
                </RouterLink>
              </li>
            </ul>
            <div className="d-flex justify-content-center align-items-center flex-column flex-lg-row  ">
              <RouterLink className="nav-link me-3" to="/login">
                Login
              </RouterLink>
              <RouterLink className="btn btn-main" to="/signup">
                Get Started
              </RouterLink>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
