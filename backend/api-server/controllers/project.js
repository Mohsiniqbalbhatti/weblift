import Project from "../models/project.js";

export const newProject = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { projectName, giturl } = req.body;

    const nameExist = await Project.findOne({ project_Name: projectName });
    if (nameExist) {
      return res.status(400).json({
        message: `oops! Project name ${projectName} already exist. Try Someother name.`,
      });
    }
    const project = new Project({
      createdBy: userId,
      project_Name: projectName,
      gitUrl: giturl,
      createdAt: Date.now(),
      subDomain: projectName,
    });
    await project.save();
    return res.status(200).json({
      message: `Project ${projectName} Created.`,
      projectID: project,
    });
  } catch (error) {
    console.log("Error creating project", error);
    return res.status(500).json({ message: "Something went wrong." });
  }
};
