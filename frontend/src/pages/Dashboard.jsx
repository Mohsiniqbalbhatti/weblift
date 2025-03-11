import { useEffect, useState } from "react";
import FileDropZone from "../components/FileDropZone";
import { FaCaretRight } from "react-icons/fa6";
import axios from "axios";
import Loader from "../components/Loader";
import { Link, useNavigate } from "react-router-dom";
function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [load, setLoad] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProjects = async () => {
      setLoad(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}project`,
          {
            withCredentials: true,
          }
        );
        if (res.data) {
          setProjects(res.data.projects);
        }
      } catch (error) {
        console.log("error", error);
      } finally {
        setLoad(false);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectClick = (projectId) => {
    navigate(`/project/${projectId}`);
  };
  return (
    <>
      <div className="row  pt-5 px-3">
        {load && <Loader />}
        <div className="dashboard mt-5">
          <div className="col-12 d-flex justify-content-between  align-items-center ">
            <input
              type="text"
              placeholder="Search sites"
              className="w-25  search"
            />
            <div className="dropdown ms-auto ms-3 me-2">
              <button
                className="dropdown-toggle d-flex align-items-center  btn-main"
                type="button"
                id="createSiteDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Add a new Site
              </button>

              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="createSiteDropdown"
              >
                <li>
                  <Link
                    className="dropdown-item"
                    to={"/createProject/githubRepo"}
                  >
                    Import an existing Project
                  </Link>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Drop & Deploy
                  </a>
                </li>
              </ul>
            </div>{" "}
          </div>
          <div className="col-12">
            <ul className="project-list">
              {/* li project */}
              {projects.map((project) => (
                <li
                  className="project d-flex justify-content-center align-items-center"
                  key={project?._id}
                  title="Click to Get More Detail"
                  onClick={() => handleProjectClick(project._id)}
                >
                  <img
                    src="https://api.microlink.io/?url=https%3A%2F%2Fstately-bunny-ac9692.netlify.app&screenshot=true&embed=screenshot.url"
                    alt="preview"
                    className="me-4"
                    style={{
                      width: "150px",
                      height: "150px",
                      borderRadius: "20px",
                    }}
                  />
                  <div className="d-flex flex-column">
                    <h5>{project?.project_Name}</h5>
                    <p>
                      Deploy Type <strong>Github</strong>
                    </p>
                  </div>
                  <div className="d-flex flex-column ms-auto me-5">
                    <p>
                      Owned By <strong>Mohsin Iqbal</strong>
                    </p>
                    <p>
                      Published on <strong>Jan 15</strong>
                    </p>
                  </div>
                  <FaCaretRight className="fs-3 my-auto" />
                </li>
              ))}
            </ul>
          </div>
          <div className="col-12">
            <FileDropZone />
          </div>
        </div>
      </div>
    </>
  );
}
export default Dashboard;
