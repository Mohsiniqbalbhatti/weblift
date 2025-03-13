import Project from "../models/project.js";
import User from "../models/user.js";

export const newProject = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { projectName, gitUrl, buildComand } = req.body;

    const nameExist = await Project.findOne({ project_Name: projectName });
    if (nameExist) {
      return res.status(400).json({
        message: `oops! Project name ${projectName} already exist. Try Someother name.`,
      });
    }
    const subdomainLowerCase = projectName.toLowerCase();
    const user = await User.findById(userId);
    const project = new Project({
      createdBy: userId,
      CreatedByName: user.name,
      project_Name: projectName,
      gitUrl: gitUrl,
      buildComand: buildComand || "npm run build",
      createdAt: Date.now(),
      subDomain: subdomainLowerCase,
    });
    await project.save();
    return res.status(200).json({
      message: `Project ${projectName} Created.`,
      projectID: project._id,
    });
  } catch (error) {
    console.log("Error creating project", error);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

export const sendProjects = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not Found!" });
    }

    const projects = await Project.find({ createdBy: userId });

    return res
      .status(200)
      .json({ message: "Projects Fetched", projects: projects });
  } catch (error) {
    console.log("Error while sending projects", error);
    res.status(500).json({ message: "Somthing went Wrong" });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;
    console.log(projectId);
    const project = await Project.findById(projectId);

    return res
      .status(200)
      .json({ message: "Projects Fetched", project: project });
  } catch (error) {
    console.log("Error while sending projects", error);
    res.status(500).json({ message: "Somthing went Wrong" });
  }
};

export const checkName = async (req, res) => {
  try {
    const { projectName } = req.body;
    const nameExist = await Project.findOne({ project_Name: projectName });
    if (nameExist) {
      return res
        .status(400)
        .json({ message: "Name not available. Try Again!" });
    }
    res.status(200).json({ message: "Name available.Go Ahead" });
  } catch (error) {
    console.log("error name check", error);
    res.status(500).json({ message: "Something Went Wrong" });
  }
};
