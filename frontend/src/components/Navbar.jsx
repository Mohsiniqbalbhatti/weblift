import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

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
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/features">
                  Features
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/docs">
                  Quick Guide
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="faq">
                  FAQs
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to={"/conact"}>
                  Contact
                </Link>
              </li>
            </ul>
            <div className="d-flex align-items-center ">
              <Link className="nav-link me-3" to={"/login"}>
                Login
              </Link>

              <button className="btn btn-main">Get Started</button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
export default Navbar;
