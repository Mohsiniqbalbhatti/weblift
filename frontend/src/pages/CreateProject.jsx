import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import { FaCaretRight } from "react-icons/fa";
import { useUser } from "../context/AuthUser";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";
function CreateProject() {
  const navigate = Navigate();
  const [load, setLoad] = useState(false);
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [checkName, setCheckName] = useState([]);
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

        setInterval(() => {
          navigate(`/project/${projectID}`);
        }, 2000);
      }
    } catch (error) {
      console.log("create Projet Error", error);
      toast.error(error?.response?.data?.message || "Something Went Wrong!");
    } finally {
      setLoad(false);
    }
  };

  //check name availability
  const handleNameCheck = async () => {
    const projectName = watch("projectName");
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
      console.log("Error", error);
      toast.error("Somthing Went Wrong");
    }
  };

  //fetch repos
  useEffect(() => {
    console.log(user);
    if (!githubToken) return;
    const getRepos = async () => {
      console.log("function runned");
      setLoad(true);
      try {
        const res = await axios.get("https://api.github.com/user/repos", {
          headers: { Authorization: `Bearer ${githubToken}` },
        });
        if (res.data) {
          console.log(res.data);
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

  //

  return (
    <>
      <div className="row pt-5">
        {load && <Loader />}
        <div className="col-12 mt-5  card">
          <h3 className="text-center mt-4">Your Github Respositories</h3>
          <p className="text-center">
            Select any Repo and Start Your new Project.
          </p>
          {repos.length > 0 ? (
            <ul className="project-list">
              {/* List item representing a deployment project */}
              {repos.map((repo, index) => (
                <li
                  key={index}
                  className="project d-flex justify-content-center align-items-center"
                  data-bs-toggle="modal"
                  data-bs-target="#createProjectModal"
                  title="Click to select this repo"
                  onClick={() => setSelectedRepo(repo)}
                >
                  <div className="d-flex flex-column">
                    <h5>{repo?.name}</h5>
                    <p>{repo?.visibility}</p>
                  </div>
                  <div className="d-flex flex-column ms-auto me-5">
                    <p>
                      Created By <strong>{repo?.owner?.login}</strong>
                    </p>
                    <p>
                      created At <strong>{repo.created_at}</strong>
                    </p>
                  </div>{" "}
                  <FaCaretRight className="fs-3 my-auto" />
                </li>
              ))}
            </ul>
          ) : (
            <p>No Repositories Found</p>
          )}
        </div>
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
                      Check Name
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
