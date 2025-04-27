import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
function Footer() {
  return (
    <>
      <footer className=" row d-flex justify-content-center align-items-center py-3 my-4 border-top ">
        <ul className="nav col justify-content-center">
          <li className="nav-item">
            <Link to={"/"} className="nav-link px-2">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to={"/docs"} className="nav-link px-2 ">
              Docs
            </Link>
          </li>
          <li className="nav-item">
            <Link to={"/contact"} className="nav-link px-2 ">
              Contact
            </Link>
          </li>
        </ul>
        <div className="d-flex d-lg-block justify-content-between ">
          <Link
            to="/"
            className="col d-flex align-items-center justify-content-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none"
          >
            <img src={logo} alt="Weblift" style={{ width: "100px" }} />
          </Link>
          <p className="col mb-0 text-light text-center">
            &copy; 2025 Weblift, Inc
          </p>
        </div>
      </footer>
    </>
  );
}
export default Footer;
