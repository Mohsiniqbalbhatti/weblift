import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import axios from "axios";

function Deployement() {
  const [load, setLoad] = useState(false);
  const [logFetching, setLogFetching] = useState(false);
  const [logs, setlogs] = useState([]);
  const [deployment, setDeployement] = useState(null);
  const { deploymentId } = useParams();
  const [isDeploymentDone, setIsDeploymentDone] = useState(false);

  const getDeployment = async () => {
    setLoad(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}deploy/deployment/${deploymentId}`,
        {
          withCredentials: true,
        }
      );
      if (res.data) {
        setDeployement(res.data.deployement);
      }
    } catch (error) {
      console.log("error", error);
      toast.error("Failed to load deployment");
    } finally {
      setLoad(false);
    }
  };

  const getLogs = async () => {
    setLogFetching(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}logs/${deploymentId}`,
        {
          withCredentials: true,
        }
      );
      if (res.data) {
        const reverseLogs = res?.data?.logs.reverse();
        setlogs(res.data.logs);
        if (res.data.logs[0]?.log === "Done") {
          setLogFetching(false);
          setIsDeploymentDone(true); // Mark deployment as done
        }
      }
    } catch (error) {
      console.log("error", error);
      toast.error("Failed to load logs");
    }
  };

  useEffect(() => {
    getDeployment();
    getLogs();
  }, [deploymentId]);

  useEffect(() => {
    // This effect is responsible for checking logs periodically if deployment is not done
    if (!isDeploymentDone) {
      const intervalId = setInterval(() => {
        getLogs();
      }, 5000);

      // Cleanup the interval when the deployment is done or when the component unmounts
      return () => clearInterval(intervalId);
    }
  }, [logs, isDeploymentDone]); // Only runs when logs or isDeploymentDone changes

  return (
    <>
      <div className="row px-3 justify-content-center">
        {load && <Loader />}
        <div className="col-12 mt-5 pt-5">
          <div className="card mb-3">
            <div className="row g-0 align-items-center pe-2">
              <div className="col-md-4">
                <img
                  src="https://api.microlink.io/?url=https://bugsbunnyreact.netlify.app&screenshot=true&embed=screenshot.url"
                  className="img-fluid rounded-start"
                  alt="..."
                />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h5 className="card-title">{deployment?.projectName}</h5>
                  <p className="">Deployment Id: {deployment?._id}</p>
                  <a
                    className="cursor-pointer text-white"
                    href={`http://${deployment?.projectName}.ihtishamhassanltd.com`}
                    target="_blank"
                  >
                    Visit Live{" "}
                  </a>
                  <p className="my-0">
                    Deploy Type <strong>Github</strong>
                  </p>
                  <p className="">Triggered By: {deployment?.createdBy}</p>
                  {deployment?.createdAt && (
                    <p className="my-0">
                      Triggered on:
                      <strong>
                        {new Date(deployment?.createdAt).toLocaleDateString()}
                      </strong>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 mt-5 pt-5 card">
          <div className="d-flex justify-content-between flex-column flex-md-row px-3">
            <h6 className="text-center">
              Logs of Deployement "{deploymentId}"
            </h6>
            <p className="mb-0">
              Logs Status:{" "}
              {logFetching ? (
                <span className="badge rounded-pill text-bg-danger">
                  Fetching
                </span>
              ) : (
                <span className="badge rounded-pill text-bg-success">Done</span>
              )}
            </p>
          </div>
          <div className="table-container">
            <table className="table table-hover logsTable">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Logs</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, index) => (
                  <tr key={log.event_id}>
                    <th scope="row">{logs?.length - index}</th>
                    <td>{log.log}</td> {/* Corrected colspan */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default Deployement;
