import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import CircularAnimation from "./CircularAnimation";
import Loader from "./Loader";
import toast from "react-hot-toast";

function FileDropZone(props) {
  const { dropfor, projectId } = props;
  const [load, setLoad] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [validFiles, setValidFiles] = useState([]);
  const [dropzoneState, setDropzoneState] = useState("idle");
  const modalRef = useRef(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const allowedExtensions = new Set([
    "html",
    "css",
    "js",
    "png",
    "jpeg",
    "jpg",
    "gif",
    "pdf",
    "xml",
    "ico",
  ]);

  const { getRootProps, getInputProps } = useDropzone({
    directory: true,
    onDropAccepted: (files) => {
      try {
        // Validate folder structure
        const hasIndexHtml = files.some((file) => {
          const pathParts = file.webkitRelativePath.split("/");
          return pathParts.length === 2 && pathParts[1] === "index.html";
        });

        if (!hasIndexHtml) {
          toast.error("Root folder must contain index.html file!");
          setDropzoneState("error");
          return;
        }

        // Validate file extensions
        const invalidFiles = files.filter((file) => {
          const ext = file.name.split(".").pop().toLowerCase();
          return !allowedExtensions.has(ext);
        });

        if (invalidFiles.length > 0) {
          toast.error(
            `Invalid file types: ${invalidFiles.map((f) => f.name).join(", ")}`
          );
          setDropzoneState("error");
          return;
        }

        setValidFiles(files);

        if (dropfor === "new") {
          setShowProjectModal(true);
        } else {
          handleProjectSubmit(); // Directly submit for existing projects
        }

        setDropzoneState("success");
      } catch (error) {
        console.error("File validation error:", error);
        toast.error("Error processing files");
        setDropzoneState("error");
      }
    },
    onDropRejected: () => {
      toast.error("Please select a valid folder");
      setDropzoneState("error");
    },
    onDragEnter: () => setDropzoneState("active"),
    onDragLeave: () => setDropzoneState("idle"),
  });

  const handleProjectSubmit = async (data) => {
    setShowProjectModal(false);
    setLoad(true);

    const formData = new FormData();

    if (dropfor === "new") {
      formData.append("projectName", data.projectName);
    }

    validFiles.forEach((file) =>
      formData.append("files", file, file.webkitRelativePath || file.name)
    );

    try {
      if (dropfor === "new") {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}project/easyDrop`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        );

        toast.success(`Project "${data.projectName}" created successfully!`);
        setTimeout(() => window.location.reload(), 1000);
      } else if (dropfor === "existing") {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}project/updateFiles/${projectId}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        );

        toast.success("Project files updated successfully!");
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Upload failed!");
    } finally {
      setLoad(false);
      setDropzoneState("idle");
    }
  };

  const getBorderColor = () => {
    switch (dropzoneState) {
      case "active":
        return "#4CAF50";
      case "error":
        return "#FF5252";
      case "success":
        return "#4CAF50";
      default:
        return "#ccc";
    }
  };

  return (
    <>
      {load && <Loader />}
      <div className="container-fluid">
        {" "}
        {/* Project Name Modal - Only for new projects */}
        {dropfor === "new" && (
          <div
            className={`modal fade ${showProjectModal ? "show d-block" : ""}`}
            style={{
              backgroundColor: `${showProjectModal ? "rgba(0,0,0,0.5)" : ""}`,
            }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Create New Project</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowProjectModal(false)}
                  />
                </div>

                <div className="modal-body">
                  <form onSubmit={handleSubmit(handleProjectSubmit)}>
                    <div className="mb-3">
                      <label htmlFor="projectName" className="form-label">
                        Project Name
                      </label>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.projectName ? "is-invalid" : ""
                        }`}
                        placeholder="Enter project name"
                        {...register("projectName", {
                          required: "Project name is required",
                          minLength: {
                            value: 3,
                            message: "Minimum 3 characters required",
                          },
                          maxLength: {
                            value: 22,
                            message: "Maximum 22 characters allowed",
                          },
                          pattern: {
                            value: /^[a-zA-Z0-9-]+$/,
                            message:
                              "Only letters, numbers and hyphens allowed",
                          },
                        })}
                      />
                      {errors.projectName && (
                        <div className="invalid-feedback">
                          {errors.projectName.message}
                        </div>
                      )}
                    </div>
                    <div className="d-flex justify-content-end gap-2">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowProjectModal(false)}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Create Project
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Dropzone */}
        <div
          {...getRootProps()}
          className="dropzone"
          style={{
            width: "100%",
            height: "500px",
            border: `2px dashed ${getBorderColor()}`,
            borderRadius: "5px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            color: "#ccc",
            cursor: "pointer",
            transition: "all 0.3s ease",
            backgroundColor:
              dropzoneState === "active"
                ? "rgba(76, 175, 80, 0.1)"
                : "transparent",
          }}
        >
          <input {...getInputProps()} webkitdirectory="true" />
          <CircularAnimation />
          <p className="text-light">
            {dropzoneState === "error"
              ? "Error - Try Again"
              : "Drag & drop folder here"}
          </p>
          <small className="text-mute mt-2 text-center text-light">
            {dropzoneState === "error"
              ? "Folder must contain index.html in root directory"
              : "Click to select folder (choose the folder itself, not its contents)"}
          </small>
          <small className="text-light mt-1">
            Allowed files: HTML, CSS, JS, Images (PNG, JPEG, GIF), PDF
          </small>
        </div>
      </div>
    </>
  );
}

export default FileDropZone;
