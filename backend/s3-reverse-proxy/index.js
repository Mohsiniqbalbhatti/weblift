import express from "express";
import httpProxy from "http-proxy";
import "dotenv/config";
import { connectDB } from "./config/database.js";
import Project from "./models/project.js";

const app = express();
const PORT = 8000;
connectDB();

// S3 Base URL
const baseUrl = "https://weblift.s3.eu-north-1.amazonaws.com/__output/";

// Create Proxy Server
const proxy = httpProxy.createProxyServer({ changeOrigin: true });

app.use(async (req, res) => {
  const hostname = req.hostname;
  const subDomain = hostname.split(".")[0];

  let id;
  try {
    console.log("subdomain", subDomain);
    const allProjects = await Project.find({});
    console.log("all project", allProjects);
    const myProject = await Project.findOne({ subDomain: subDomain });
    if (myProject) {
      id = myProject._id;
      console.log("project", myProject);
      // Update visit count
      const newVisits = (myProject.visits || 0) + 1;
      await Project.findByIdAndUpdate(
        id,
        { $set: { visits: newVisits } },
        { new: true }
      );
    } else {
      console.log("No project found for subdomain:", subDomain);
    }
  } catch (error) {
    console.log("error in getting project id", error);
  }

  // Construct S3 URL using the obtained project id (if any)
  const resolveTo = id ? `${baseUrl}${id}` : baseUrl;

  // If the request is for "/", modify it to serve "index.html"
  if (req.url === "/") {
    req.url = "/index.html"; // Rewrite URL to explicitly request index.html
  }

  // Proxy the request to S3
  proxy.web(req, res, { target: resolveTo }, (err) => {
    console.error("Proxy Error:", err);
    res.status(500).send("Proxy Error");
  });
});

// Ensure Root Requests are Correctly Handled
proxy.on("proxyReq", (proxyReq, req, res) => {
  if (req.url === "/") {
    proxyReq.path = "/index.html"; // Ensure index.html is explicitly requested
  }
});

// Start Server
app.listen(PORT, () => console.log(`Reverse Proxy running on port ${PORT}`));
