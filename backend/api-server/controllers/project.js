import mongoose from "mongoose";
import Project from "../models/project.js";
import User from "../models/user.js";
import fs from "fs";
import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";

import { randomBytes } from "crypto";
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

    const inviteCode = randomBytes(6).toString("hex");
    const project = new Project({
      createdBy: userId,
      CreatedByName: user.name,
      project_Name: projectName,
      gitUrl: gitUrl,
      buildCommand: buildComand?.trim() || "npm run build",
      createdAt: Date.now(),
      subDomain: subdomainLowerCase,
      teamInviteCode: inviteCode, // add team invite code
      teamMembers: [
        {
          userID: userId,
          name: user.name,
          access: "admin", // project creator is default admin
        },
      ],
    });

    await project.save();
    return res.status(200).json({
      message: `Project ${projectName} Created.`,
      projectID: project._id,
      inviteCode: inviteCode, // return this to show admin
    });
  } catch (error) {
    console.error("Error creating project", error);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

export const sendProjects = async (req, res) => {
  try {
    const userId = req.user.userId;

    const projects = await Project.find({
      $or: [
        { createdBy: userId },
        { "teamMembers.userID": userId }, // also fetch projects where user is team member
      ],
    });

    return res
      .status(200)
      .json({ message: "Projects Fetched", projects: projects });
  } catch (error) {
    console.error("Error while sending projects", error);
    res.status(500).json({ message: "Something went Wrong" });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);

    return res
      .status(200)
      .json({ message: "Projects Fetched", project: project });
  } catch (error) {
    console.error("Error while sending projects", error);
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
    console.error("error name check", error);
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

export const joinTeam = async (req, res) => {
  try {
    console.log("join request");
    const { userId } = req.user;
    const { inviteCode } = req.body; // changed from teamCode to inviteCode

    if (!inviteCode) {
      return res.status(400).json({ message: "Team invite code is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const project = await Project.findOne({ teamInviteCode: inviteCode }); // lookup by inviteCode now
    if (!project) {
      return res.status(404).json({ message: "Invalid invite code" });
    }

    const userAlreadyExists = project.teamMembers.some(
      (member) => member.userID?.toString() === userId
    );

    if (userAlreadyExists) {
      return res.status(400).json({ message: "Already part of the project" });
    }

    project.teamMembers.push({
      name: user.name,
      userID: user._id,
      access: "visitor",
    });

    await project.save();

    res.json({ message: "Team joined successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// New: Delete a team member (only allowed by admin)
export const deleteTeamMember = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { projectId, memberId } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const requester = project.teamMembers.find(
      (m) => m.userID.toString() === userId
    );
    if (!requester || requester.access !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (userId === memberId) {
      return res
        .status(400)
        .json({ message: "Admin cannot remove themselves" });
    }

    project.teamMembers = project.teamMembers.filter(
      (m) => m.userID.toString() !== memberId
    );

    await project.save();
    res.status(200).json({ message: "Team member removed" });
  } catch (error) {
    console.error("Error removing member", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// New: Edit a team member's role (only allowed by admin)
export const editTeamMemberRole = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { projectId, memberId, newRole } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const requester = project.teamMembers.find(
      (m) => m.userID.toString() === userId
    );
    if (!requester || requester.access !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const member = project.teamMembers.find(
      (m) => m.userID.toString() === memberId
    );

    if (!member) {
      return res.status(404).json({ message: "Team member not found" });
    }

    member.access = newRole;
    await project.save();

    res.json({ message: "Team member role updated" });
  } catch (error) {
    console.error("Error updating member role", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// New: Change project name (only by creator or admin)
export const changeProjectName = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { projectId, newName } = req.body;

    // Check for duplicate project name
    const existing = await Project.findOne({ project_Name: newName }); // <-- Fixed field
    if (existing && existing._id.toString() !== projectId) {
      return res.status(400).json({ message: "Project name already in use" });
    }

    // Update only if user is creator or admin
    const project = await Project.findOneAndUpdate(
      {
        _id: projectId,
        $or: [
          { createdBy: userId },
          { teamMembers: { $elemMatch: { userID: userId, access: "admin" } } },
        ],
      },
      { project_Name: newName }, // <-- Fixed field
      { new: true }
    );

    if (!project)
      return res
        .status(403)
        .json({ message: "Not authorized or project not found" });

    res
      .status(200)
      .json({ message: "Project name updated successfully", project });
  } catch (error) {
    console.error("Error updating project name", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// controller for easydrop

const s3Client = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const easyDrop = async (req, res) => {
  try {
    const { projectName } = req.body;
    const files = req.files;
    const userId = req.user.userId;
    // Generate invite code for direct upload projects
    const inviteCode = randomBytes(6).toString("hex");
    // Validate project name
    const nameExist = await Project.findOne({ project_Name: projectName });
    if (nameExist) {
      return res.status(400).json({ message: "Project name not available" });
    }

    // Create project
    const user = await User.findById(userId);
    const projectId = new mongoose.Types.ObjectId();

    const project = new Project({
      _id: projectId,
      createdBy: userId,
      CreatedByName: user.name,
      project_Name: projectName,
      teamInviteCode: inviteCode, //
      subDomain: projectName.toLowerCase(),
      deployment_Type: "DirectUpload",
      teamMembers: [
        {
          userID: userId,
          name: user.name,
          access: "admin",
        },
      ],
    });

    // Upload files to S3
    const uploadPromises = files.map((file) => {
      const fileKey = `__output/${projectId}/${file.originalname}`;
      return s3Client.send(
        new PutObjectCommand({
          Bucket: "weblift",
          Key: fileKey,
          Body: fs.readFileSync(file.path),
          ContentType: file.mimetype,
        })
      );
    });

    await Promise.all(uploadPromises);

    // Update project with S3 location
    project.s3Location = `s3://weblift/__output/${projectId}`;
    await project.save();

    // Clean temp files
    files.forEach((file) => fs.unlinkSync(file.path));

    res.status(200).json({
      message: "Project created successfully",
      projectId: projectId,
      subDomain: project.subDomain,
    });
  } catch (error) {
    console.error("EasyDrop Error:", error);
    res.status(500).json({ message: "Project creation failed" });
  }
};

// Add to project.js
export const updateProjectFiles = async (req, res) => {
  try {
    const { projectId } = req.params;
    const files = req.files;
    const userId = req.user.userId;

    // Verify project exists and user has access
    const project = await Project.findOne({
      _id: projectId,
      "teamMembers.userID": userId,
      "teamMembers.access": { $in: ["admin", "editor"] },
    });

    if (!project) {
      return res
        .status(403)
        .json({ message: "Not authorized or project not found" });
    }

    // Delete existing files in S3
    const listParams = {
      Bucket: "weblift",
      Prefix: `__output/${projectId}/`,
    };

    const listedObjects = await s3Client.send(
      new ListObjectsV2Command(listParams)
    );
    if (listedObjects.Contents?.length > 0) {
      const deleteParams = {
        Bucket: "weblift",
        Delete: {
          Objects: listedObjects.Contents.map(({ Key }) => ({ Key })),
        },
      };
      await s3Client.send(new DeleteObjectsCommand(deleteParams));
    }

    // Upload new files
    const uploadPromises = files.map((file) => {
      const fileKey = `__output/${projectId}/${file.originalname}`;
      return s3Client.send(
        new PutObjectCommand({
          Bucket: "weblift",
          Key: fileKey,
          Body: fs.readFileSync(file.path),
          ContentType: file.mimetype,
        })
      );
    });

    await Promise.all(uploadPromises);

    // Clean temp files
    files.forEach((file) => fs.unlinkSync(file.path));

    res.status(200).json({
      message: "Project files updated successfully",
      projectId: projectId,
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Failed to update project files" });
  }
};

export const analytics = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .select("dailyVisits createdAt")
      .lean();

    const formattedData = project.dailyVisits
      ?.map((entry) => ({
        date: entry.date.toISOString().split("T")[0],
        visitors: entry.count,
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json({
      dailyVisits: formattedData,
      createdAt: project.createdAt,
    });
  } catch (error) {
    console.log("server", error);
    res.status(500).json({ error: "Server error" });
  }
};
