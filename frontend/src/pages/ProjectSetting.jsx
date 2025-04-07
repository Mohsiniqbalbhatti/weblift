import { FaCaretRight } from "react-icons/fa6";
import TeamList from "../components/TeamList";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useUser } from "../context/AuthUser";
import FileDropZone from "../components/FileDropZone";
import Analytics from "../components/Analytics";

function ProjectSetting() {
  const { user } = useUser();
  const [team, setTeam] = useState([]);
  const [deploymentAccess, setDeploymentAccess] = useState(false);
  const [adminAccess, setAdminAccess] = useState(false);
  const { projectId } = useParams();
  const [githubDeployment, setGithubDeployment] = useState(true);
  const [Deployements, setDeployements] = useState([]);
  const [project, setProject] = useState(null);
  const [load, setLoad] = useState(false);
  const navigate = useNavigate();

  const getProjectInfo = async () => {
    setLoad(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}project/${projectId}`,
        {
          withCredentials: true,
        }
      );
      if (res.data) {
        setProject(res.data.project);
        setTeam(res.data?.project?.teamMembers);
      }
    } catch (error) {
      console.log("error", error);
      toast.error("Failed to load project info");
    } finally {
      setLoad(false);
    }
  };

  const getDeployements = async () => {
    setLoad(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}deploy/getdeployments/${projectId}`,
        {
          withCredentials: true,
        }
      );
      if (res.data) {
        const reverseDeployements = res?.data?.deployments.reverse();
        setDeployements(reverseDeployements);
      }
    } catch (error) {
      console.log("error", error);
      toast.error("Failed to load deployments");
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    getDeployements();
    getProjectInfo();
  }, [projectId]);

  const handleDeploymentClick = async (deploymentId) => {
    navigate(`/deployment/${deploymentId}`);
  };

  const triggerDeployement = async () => {
    const data = {
      projectId: projectId,
    };

    setLoad(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}deploy`,
        data,
        {
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        toast.success("Deployment triggered");
        await getDeployements();
      } else if (res.status === 400 || res.status === 404) {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log("Error", error);
      toast.error("Error triggering deployment");
    } finally {
      setLoad(false);
    }
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm();

  const onSubmit = async (data) => {
    const projectData = {
      newName: data.newName,
      projectId: projectId,
    };
    console.log("project name data", projectData);
    setLoad(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}project/editName`,
        projectData,
        {
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        toast.success(res.data.message);
        console.log(res?.data);
        getProjectInfo();
      }
    } catch (error) {
      console.log("error joining team", error);
      toast.error(error?.response?.data?.message || "Something Went Wrong!");
    } finally {
      setLoad(false);
    }
  };

  const checkdeploymentAccess = () => {
    if (!project || !user) return;
    const isGitHubProject = project.deployment_Type === "Github";
    setGithubDeployment(isGitHubProject);
    const member = project.teamMembers.find((m) => {
      const teamMemberId =
        typeof m.userID === "object" && m.userID.$oid
          ? m.userID.$oid
          : m.userID;
      return (
        teamMemberId === user._id &&
        (m.access === "admin" || m.access === "editor")
      );
    });
    setDeploymentAccess(!!member);
  };
  const checkadminAccess = () => {
    if (!project || !user) return;
    const member = project.teamMembers.find((m) => {
      const teamMemberId =
        typeof m.userID === "object" && m.userID.$oid
          ? m.userID.$oid
          : m.userID;
      return teamMemberId === user._id && m.access === "admin";
    });
    setAdminAccess(!!member);
  };

  useEffect(() => {
    checkdeploymentAccess();
    checkadminAccess();
  }, [project, user]);
  return (
    <>
      <div className="row px-3 pt-5">
        {load && <Loader />}
        <div className="col-12 card p-3 mt-5 pt-5">
          <h3 className="text-center my-2">
            Heres the Live Analytics for your site!
          </h3>
          <Analytics projectId={projectId} />{" "}
        </div>
        <div className="col-6">
          <div className="row">
            <div className="col-12  pt-5">
              <div className="card mb-3">
                <div className="row g-0 align-items-center px-2">
                  <div className="col-md-4">
                    <img
                      src="https://api.microlink.io/?url=https://bugsbunnyreact.netlify.app&screenshot=true&embed=screenshot.url"
                      className="img-fluid rounded-start"
                      alt="..."
                    />
                  </div>
                  <div className="col-md-8">
                    <div className="card-body">
                      <h5 className="card-title">{project?.project_Name}</h5>
                      <a
                        className="cursor-pointer text-white"
                        href={`http://${project?.project_Name}.localhost:8000`}
                        target="_blank"
                      >
                        Visit Live{" "}
                      </a>
                      <p className="my-0">
                        Deploy Type <strong>Github</strong>
                      </p>
                      <p className="my-0">
                        Published on <strong>Jan 15</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12">
              <TeamList
                team={team}
                inviteCode={project?.teamInviteCode}
                adminAccess={adminAccess}
                projectId={projectId}
              />
            </div>
          </div>
        </div>

        <div className="col-6 mt-5 pt-5">
          <div className="card mb-3" style={{ minHeight: "387px" }}>
            <div className="row g-0 align-items-center px-2">
              <div className="col-12">
                <div className="card-body" style={{ height: "100%" }}>
                  <h5 className="card-title">General Site Information</h5>
                  <table className="table siteInfoTable table-hover">
                    <tbody>
                      <tr>
                        <th scope="row">Site Name</th>
                        <td>{project?.project_Name}</td>
                      </tr>
                      <tr>
                        <th scope="row">Owner</th>
                        <td>{project?.CreatedByName}</td>
                      </tr>
                      <tr>
                        <th scope="row">site ID</th>
                        <td>{project?._id}</td>
                      </tr>
                      {adminAccess && (
                        <tr>
                          <th scope="row">Project Team Code</th>
                          <td>{project?.teamInviteCode}</td>
                        </tr>
                      )}
                      <tr>
                        <th scope="row">created at</th>
                        <td>{new Date(project?.createdAt).toDateString()}</td>
                      </tr>
                      {adminAccess && (
                        <tr className="mt-auto">
                          <th scope="row">
                            <button
                              className="btn-main"
                              type=""
                              data-bs-toggle="modal"
                              data-bs-target="#changeName"
                            >
                              Change Site Name
                            </button>
                          </th>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {githubDeployment ? (
          <div className="col-12 card mt-3">
            <div className="d-flex justify-content-between">
              <h3 className="text-center mt-4">Production Deploys</h3>
              {deploymentAccess && (
                <button className="btn-main my-3" onClick={triggerDeployement}>
                  Trigger Deployment
                </button>
              )}
            </div>
            {Deployements.length > 0 ? (
              <ul className="project-list">
                {Deployements.map((deployment) => (
                  <li
                    key={deployment._id}
                    className="project d-flex justify-content-center align-items-center"
                    title="Click to view Deployment Logs"
                    onClick={() => handleDeploymentClick(deployment._id)}
                  >
                    <div className="d-flex flex-column">
                      <h5>Deployment ID</h5>
                      <p>{deployment?._id}</p>
                    </div>
                    <div className="d-flex flex-column ms-auto me-5">
                      <p>
                        Deployed By <strong>Mohsin Iqbal</strong>
                      </p>
                      <p>
                        Deployment Date{" "}
                        <strong>
                          {new Date(deployment?.createdAt).toLocaleString()}
                        </strong>
                      </p>
                    </div>
                    <FaCaretRight className="fs-3 my-auto" />
                  </li>
                ))}
              </ul>
            ) : (
              <p>No Deployments Found</p>
            )}
          </div>
        ) : (
          <div className="row  ">
            <div className="col-12 px-auto ">
              <div className="row card mx-auto">
                {" "}
                <div className="col-12 py-5">
                  <h3 className="text-center text-light">
                    Need to update the site ? just drop the folder
                  </h3>{" "}
                </div>
                <div className="col-12">
                  <FileDropZone dropfor={"existing"} projectId={projectId} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* modal  */}
        <div
          className="modal fade"
          id="changeName"
          tabIndex="-1"
          aria-labelledby="changeNameLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="changeName">
                  Want to Change the Site name ?{" "}
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
                    <label htmlFor="newName">Enter new Name</label>
                    <input
                      type="text"
                      placeholder="Enter new name"
                      className="form-control text-dark"
                      {...register("newName", {
                        required: "new name is required",
                      })}
                    />
                    {errors.newName && (
                      <span className="text-danger">
                        {errors.newName.message}
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
      </div>
    </>
  );
}

export default ProjectSetting;
