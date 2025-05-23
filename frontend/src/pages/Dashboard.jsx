import { useEffect, useState } from "react";
import FileDropZone from "../components/FileDropZone";
import { FaCaretRight } from "react-icons/fa6";
import axios from "axios";
import Loader from "../components/Loader";
import { Link, useNavigate } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { useUser } from "../context/AuthUser";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
function Dashboard() {
  const { user } = useUser();
  const navigate = useNavigate();

  if (!user) {
    navigate("/");
    return null;
  }
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [load, setLoad] = useState(false);
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
        console.log("res", res?.data);
        setProjects(res.data.projects);
        setFilteredProjects(res.data.projects);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoad(false);
    }
  };
  useEffect(() => {
    fetchProjects();
  }, []);

  const handleProjectClick = (projectId) => {
    navigate(`/project/${projectId}`);
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm();

  const onSubmit = async (data) => {
    const inviteCodeData = {
      inviteCode: data.inviteCode,
    };
    console.log("team code", inviteCodeData);
    setLoad(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}project/joinTeam`,
        inviteCodeData,
        {
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        toast.success("Project Joined via team code!");
        fetchProjects();
      }
    } catch (error) {
      console.log("error joining team", error);
      toast.error(error?.response?.data?.message || "Something Went Wrong!");
    } finally {
      setLoad(false);
    }
  };

  const searchProject = (e) => {
    const value = e.target.value.toLowerCase();

    if (!value) {
      // ✅ Reset to full list when input is cleared
      setFilteredProjects(projects);
      return;
    }

    const matched = projects.filter((project) =>
      project.project_Name.toLowerCase().includes(value)
    );

    setFilteredProjects(matched);
  };

  return (
    <>
      <div className="row  pt-5 px-3">
        {load && <Loader />}
        <div className="dashboard mt-5">
          <div className="col-12 d-flex justify-content-between  align-items-center flex-column flex-md-row">
            <input
              type="text"
              placeholder="Search sites"
              className="w-auto  search"
              onChange={(e) => searchProject(e)}
            />
            <div className="d-flex justify-content-between align-items-center my-3 my-md-0">
              <button
                className="btn-main mx-1"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#joinTeam"
              >
                Join Team
              </button>
              <div className="dropdown ms-auto ms-3 me-2 dropdown-bg">
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
                      className="dropdown-item text-dark"
                      to={"/createProject/githubRepo"}
                    >
                      Import an existing Project
                    </Link>
                  </li>
                  <li>
                    <ScrollLink
                      className="dropdown-item text-dark"
                      to="drop"
                      smooth="true"
                      duration={300}
                    >
                      Drop & Deploy
                    </ScrollLink>
                  </li>
                </ul>
              </div>
            </div>{" "}
          </div>
          <div className="col-12">
            <ul className="project-list">
              {/* li project */}
              {filteredProjects.map((project) => (
                <li
                  className="  project d-flex justify-content-center align-items-center flex-column flex-sm-row"
                  key={project?._id}
                  title="Click to Get More Detail"
                  onClick={() => handleProjectClick(project?._id)}
                >
                  <img
                    src="https://api.microlink.io/?url=https://bugsbunnyreact.netlify.app&screenshot=true&embed=screenshot.url"
                    alt="preview"
                    className="me-4"
                    style={{
                      width: "150px",
                      height: "130px",
                      borderRadius: "20px",
                    }}
                  />
                  <div className="col d-flex flex-column flex-lg-row mt-3 mt-sm-0 justify-content-center align-items-center ">
                    {" "}
                    <div className="d-flex flex-column justify-content-center align-items-center justify-content-sm-start align-items-sm-start">
                      <h5>{project?.project_Name}</h5>
                      <p>
                        Deploy Type <strong>{project?.deployment_Type}</strong>
                      </p>
                    </div>
                    <div className="d-flex flex-column ms-lg-auto me-lg-5 justify-content-center align-items-center justify-content-sm-start align-items-sm-start">
                      <p>
                        Owned By <strong>{project?.CreatedByName}</strong>
                      </p>
                      <p>
                        Published on{" "}
                        <strong>
                          {new Date(project?.createdAt).toLocaleString()}
                        </strong>
                      </p>
                    </div>
                  </div>
                  <FaCaretRight className="fs-3  my-auto me-auto mx-auto mx-sm-0" />
                </li>
              ))}
            </ul>
          </div>
          <div className="col-12" id="drop">
            <FileDropZone dropfor={"new"} />
          </div>
        </div>
      </div>
      {/* modal  */}
      <div
        className="modal fade"
        id="joinTeam"
        tabIndex="-1"
        aria-labelledby="joinTeamLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="joinTeam">
                Have a invite Code? Join now!
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label htmlFor="teamCode">Enter the Team invite Code</label>
                  <input
                    type="text"
                    placeholder="Enter the Team Code"
                    className="form-control text-dark"
                    {...register("inviteCode", {
                      required: "Team invite Code is required",
                      minLength: {
                        value: "10",
                        message: "Kindly add a valid invite Code",
                      },
                    })}
                  />
                  {errors.inviteCode && (
                    <span className="text-danger">
                      {errors.inviteCode.message}
                    </span>
                  )}
                </div>
                <button className="btn-main" type="submit">
                  Join
                </button>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Dashboard;
