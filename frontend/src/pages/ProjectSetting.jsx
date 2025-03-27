import { FaCaretRight } from "react-icons/fa6";
import TeamList from "../components/TeamList";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import { useNavigate, useParams } from "react-router-dom";

function ProjectSetting() {
  const { projectId } = useParams();
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
      } else if (res.status === 400 || 404) {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log("Error", error);
      toast.error("Error triggering deployment");
    } finally {
      setLoad(false);
    }
  };

  return (
    <>
      <div className="row px-3">
        {load && <Loader />}
        <div className="col-6">
          <div className="row">
            <div className="col-12 mt-5 pt-5">
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
              <TeamList />
            </div>
          </div>
        </div>

        <div className="col-6 mt-5 pt-5">
          <div className="card mb-3" style={{ minHeight: "387px" }}>
            <div className="row g-0 align-items-center px-2">
              <div className="col-12">
                <div className="card-body">
                  <h5 className="card-title">General Site Information</h5>
                  <table className="table siteInfoTable table-hover">
                    <tbody>
                      <tr>
                        <th scope="row">Site Name</th>
                        <td>chipper-bonbon-590929</td>
                      </tr>
                      <tr>
                        <th scope="row">Owner</th>
                        <td>Mohsin Iqbal</td>
                      </tr>
                      <tr>
                        <th scope="row">site ID</th>
                        <td>23162873612UASD213</td>
                      </tr>
                      <tr>
                        <th scope="row">created at</th>
                        <td>23-03-2024</td>
                      </tr>
                      <tr>
                        <th scope="row">Last Update</th>
                        <td>23-03-2024</td>
                      </tr>
                      <tr>
                        <th scope="row">
                          <button className="btn-main">Change Site Name</button>
                        </th>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 card mt-4">
          <div className="d-flex justify-content-between">
            <h3 className="text-center mt-4">Production Deploys</h3>
            <button className="btn-main my-3" onClick={triggerDeployement}>
              Trigger Deployment
            </button>
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
      </div>
    </>
  );
}

export default ProjectSetting;
