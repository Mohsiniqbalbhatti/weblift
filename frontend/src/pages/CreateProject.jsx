import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import { FaCaretRight, FaGithub } from "react-icons/fa";
import { useUser } from "../context/AuthUser";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import logo from "../assets/logo.png";
import github from "../assets/GitHub.png";

import { useNavigate } from "react-router-dom";
function CreateProject() {
  const navigate = useNavigate();
  const [load, setLoad] = useState(false);
  const [githubLogin, setGithubLogin] = useState(true);
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [checkName, setCheckName] = useState([]);
  const [projectNameCheck, setProjectNameCheck] = useState(false);
  const { user } = useUser();
  const githubToken = user?.githubToken;
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm();
  const onSubmit = async (data) => {
    setLoad(true);
    const projectData = {
      projectName: data.projectName,
      gitUrl: selectedRepo?.clone_url,
      buildComand: data.buildComand,
    };

    let navigationTimeout;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}project`,
        projectData,
        {
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        toast.success("Project Create SuccessFully");

        // Keep loading state during navigation to prevent user interaction
        // Navigate after a short delay to ensure backend processing is complete
        navigationTimeout = setTimeout(() => {
          navigate(`/project/${res?.data?.projectID}`);
        }, 1500); // Increased delay to ensure backend processing is complete
      }
    } catch (error) {
      console.error("create Projet Error", error);
      toast.error(error?.response?.data?.message || "Something Went Wrong!");
      setLoad(false); // Only reset load state on error
    }

    // Cleanup function to clear timeout if component unmounts
    return () => {
      if (navigationTimeout) {
        clearTimeout(navigationTimeout);
      }
    };
  };

  //check name availability
  const handleNameCheck = async () => {
    const projectName = watch("projectName");
    if (projectName.trim() === "") {
      toast.error("Project Name cant be empty");
      return;
    }
    setProjectNameCheck(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}project/checkName`,
        projectName,
        {
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        const checkName = {
          availability: true,
          message: res.data.message,
        };
        setCheckName(checkName);
      } else if (res.status === 400) {
        const checkName = {
          availability: false,
          message: res.data.message,
        };
        setCheckName(checkName);
      }
    } catch (error) {
      console.error("Error", error);
      toast.error("Somthing Went Wrong");
    } finally {
      setProjectNameCheck(false);
    }
  };

  //fetch repos
  useEffect(() => {
    if (!githubToken) {
      console.log("Github token from user", githubToken);
      console.log("user", user);
      setGithubLogin(false);
      return;
    }

    const getRepos = async () => {
      setLoad(true);
      try {
        const res = await axios.get("https://api.github.com/user/repos", {
          headers: { Authorization: `Bearer ${githubToken}` },
        });
        if (res.data) {
          setRepos(res.data);
        }
      } catch (error) {
        console.error("Error fetching repositories", error);
      } finally {
        setLoad(false);
      }
    };
    getRepos();
  }, []);

  //  login with github
  //  User clicks "Login with GitHub" (calls backend)
  const connectGithub = () => {
    const state = "/createProject/githubRepo";

    window.location.assign(
      `https://github.com/login/oauth/authorize?client_id=${
        import.meta.env.VITE_GITHUB_CLIENT_ID
      }&scope=repo,user,email&state=${state}`
    );
  };
  useEffect(() => {
    const fetchGitHubToken = async () => {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const githubCodeParam = urlParams.get("code");
      const githubStateParam = urlParams.get("state");

      if (!githubCodeParam) {
        return;
      }
      if (githubCodeParam) {
        setLoad(true);
      }
      if (sessionStorage.getItem("connect-github")) return; // ✅ Prevent duplicate requests
      sessionStorage.setItem("connect-github", "true"); // ✅ Set flag to prevent re-execution

      try {
        const data = {
          code: githubCodeParam,
          userEmail: user?.email,
        };
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}user/connectGithub`,
          data,
          { withCredentials: true }
        );

        if (response.status === 200) {
          toast.success(response.data.message);
          window.location.href =
            githubStateParam || "/createProject/githubRepo";
        }
      } catch (error) {
        console.error("GitHub connection Error:", error);
        toast.error(error.response.data.message || "Something went wrong.");
      } finally {
        sessionStorage.removeItem("connect-github");
        setLoad(false);
      }
    };

    fetchGitHubToken();
  }, []);

  return (
    <>
      {load && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            zIndex: 10000,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
          }}
        >
          <Loader />
          <p className="mt-3 text-center">
            Creating project from GitHub repository...
          </p>
          <p className="mt-2 text-center text-muted">
            Please wait while we set up your project
          </p>
        </div>
      )}
      <div className="row pt-5 px-2 px-lg-3" style={{ minHeight: "80vh" }}>
        {githubLogin ? (
          <div className="col-12 mt-5  card">
            <h3 className="text-center mt-4">Your Github Respositories</h3>
            <p className="text-center">
              Select any Repo and Start Your new Project.
            </p>
            {repos?.length > 0 ? (
              <ul className="project-list">
                {/* List item representing a deployment project */}
                {repos.map((repo, index) => (
                  <li
                    className="  project d-flex justify-content-start align-items-start flex-row"
                    data-bs-toggle="modal"
                    data-bs-target="#createProjectModal"
                    title="Click to select this repo"
                    key={index}
                    onClick={() => setSelectedRepo(repo)}
                  >
                    <div className="col d-flex flex-column flex-lg-row mt-3 mt-sm-0   ">
                      {" "}
                      <div className="d-flex flex-column justify-content-start align-items-start ">
                        <h5>{repo?.name}</h5>
                        <p>{repo?.visibility}</p>
                      </div>
                      <div className="d-flex flex-column ms-lg-auto me-lg-5 justify-content-start align-items-start">
                        <p>
                          Created By <strong>{repo?.owner?.login}</strong>
                        </p>
                        <p>
                          created At{" "}
                          <strong>
                            {new Date(repo?.created_at).toLocaleString()}
                          </strong>
                        </p>
                      </div>
                    </div>
                    <FaCaretRight className="fs-3  my-auto me-auto mx-auto mx-sm-0" />
                  </li>
                ))}
              </ul>
            ) : (
              <p>No Repositories Found</p>
            )}
          </div>
        ) : (
          <div className="col-12 mt-5  card d-flex justify-content-center align-items-center">
            <h5 className="my-3">
              Authenticate your account with github to get Repo Acess!
            </h5>
            <div className="d-flex justify-content-center align-items-center">
              <img
                src={logo}
                alt="weblift.png"
                className="img-fluid pe-2"
                style={{ width: "180px" }}
              />{" "}
              x
              <img
                src={github}
                alt="weblift.png"
                className="img-fluid ps-2"
                style={{ width: "80px", height: "80px", filter: "invert(1)" }}
              />
            </div>
            <button
              className="px-3 py-2 w-25 border-0 my-4 rounded-pill my-2"
              onClick={connectGithub}
            >
              Login with Github <FaGithub className="fs-4" />
            </button>
          </div>
        )}
      </div>
      {/* <!-- Create Project Modal --> */}
      <div
        className="modal fade "
        id="createProjectModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">
                Create Project
              </h1>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* name Field */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Enter Your Project Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="projectName"
                    aria-describedby="emailHelp"
                    {...register("projectName", {
                      required: "Project Name is required",
                    })}
                  />
                  {errors.name && (
                    <span className="text-danger">
                      {errors.projectName.message}
                    </span>
                  )}
                  <div className="d-flex justify-content-between flex-row-reverse align-items-center my-2">
                    <button
                      type="button"
                      className="btn-danger btn"
                      onClick={handleNameCheck}
                    >
                      {projectNameCheck ? "Checking Name" : "Check Name"}
                    </button>
                    <p
                      className={`my-auto ${
                        checkName?.availability ? "text-success" : "text-danger"
                      }`}
                    >
                      {checkName?.message}
                    </p>
                  </div>
                </div>
                {/* Build Comaand */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Enter Build Comand
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="buildComand"
                    aria-describedby="emailHelp"
                    {...register("buildComand")}
                  />
                  {errors.name && (
                    <span className="text-danger">
                      {errors.buildComand.message}
                    </span>
                  )}
                </div>
                {/* Clone Url  */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Clone URL
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="gitUrl"
                    disabled
                    aria-describedby="emailHelp"
                    value={selectedRepo?.clone_url}
                    {...register("gitUrl")}
                  />
                  {errors.name && (
                    <span className="text-danger">
                      {errors.buildComand.message}
                    </span>
                  )}
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <button type="submit" className="btn-main">
                    Create Project
                  </button>
                </div>
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
export default CreateProject;
