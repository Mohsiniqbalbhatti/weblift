import axios from "axios";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import CircularAnimation from "./CircularAnimation";
import Loader from "./Loader";
import toast from "react-hot-toast"; // ✅ Import toast for error messages

function FileDropZone() {
  const [load, setLoad] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    directory: true, // ✅ Enables folder selection
    onDropAccepted: async (files) => {
      // ✅ Check if folder contains index.html
      const hasIndexHtml = files.some((file) => file.name === "index.html");

      if (!hasIndexHtml) {
        toast.error("Upload a folder containing an index.html file!");
        return;
      }

      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      setLoad(true);
      try {
        const res = await axios.post("http://localhost:4000/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
        console.log("Upload success:", res.data);
        toast.success("Folder uploaded successfully!");
      } catch (error) {
        console.error("Upload error:", error.response?.data || error.message);
        toast.error("Upload failed!");
      } finally {
        setLoad(false);
      }
    },
    onDropRejected: () => {
      toast.error("Please upload a valid folder.");
    },
  });

  return (
    <>
      {load && <Loader />}
      <div
        {...getRootProps()}
        className="dropzone"
        style={{
          width: "100%",
          height: "300px",
          border: "2px dashed #ccc",
          borderRadius: "5px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
          color: "#ccc",
          cursor: "pointer",
          transition: "border-color 0.3s ease",
        }}
      >
        <input {...getInputProps()} webkitdirectory="true" />{" "}
        {/* ✅ Enable folder selection */}
        <CircularAnimation />
        <p className="text-light">
          Drag & drop folders here, or click to select
        </p>
      </div>
    </>
  );
}

export default FileDropZone;
