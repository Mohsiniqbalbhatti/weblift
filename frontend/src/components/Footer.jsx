import logo from "../assets/logo.png";

function Footer() {
  return (
    <>
      <footer className=" row d-flex justify-content-center align-items-center py-3 my-4 border-top ">
        <ul className="nav col justify-content-center">
          <li className="nav-item">
            <a href="#" className="nav-link px-2">
              Home
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link px-2 ">
              Features
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link px-2 ">
              Pricing
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link px-2 ">
              FAQs
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link px-2 ">
              About
            </a>
          </li>
        </ul>
        <div className="d-flex d-lg-block justify-content-between ">
          <a
            href="/"
            className="col d-flex align-items-center justify-content-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none"
          >
            <img src={logo} alt="Weblift" style={{ width: "100px" }} />
          </a>
          <p className="col mb-0 text-light text-center">
            &copy; 2025 Weblift, Inc
          </p>
        </div>
      </footer>
    </>
  );
}
export default Footer;
