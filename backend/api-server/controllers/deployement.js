import { ECSClient, RunTaskCommand } from "@aws-sdk/client-ecs";
import Project from "../models/project.js";
import Deployement from "../models/deployement.js";
import User from "../models/user.js";
// seting up ECS clinet
const ecsClient = new ECSClient({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// configuration for task command
const config = {
  CLUSTER: "arn:aws:ecs:eu-north-1:615299731132:cluster/builder-cluster",
  TASK: "arn:aws:ecs:eu-north-1:615299731132:task-definition/builder-task",
};

// deployment function
export const deployment = async (req, res) => {
  try {
    const { projectId } = req.body;
    const userId = req.user.userId;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(400).json({
        message: `oops! Project not Found`,
      });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const deployment = new Deployement({
      createdBy: user.name,
      projectName: project.project_Name,
      projectId: projectId,
      status: "Queued",
    });
    await deployment.save();
    // Spin the container
    const command = new RunTaskCommand({
      cluster: config.CLUSTER,
      taskDefinition: config.TASK,
      launchType: "FARGATE",
      count: 1,
      networkConfiguration: {
        awsvpcConfiguration: {
          assignPublicIp: "ENABLED",
          subnets: [
            "subnet-0fc891eb2753d3bde",
            "subnet-07df3a79abb2ab0c4",
            "subnet-0386453c079a52e54",
          ],
          securityGroups: ["sg-0975403babdcd76b9"],
        },
      },
      overrides: {
        containerOverrides: [
          {
            name: "builder-image",
            environment: [
              { name: "GIT_REPOSITORY_URL", value: project.gitUrl },
              { name: "PROJECT_ID", value: projectId },
              { name: "BUILD_COMMAND", value: project.buildComand },
              { name: "DEPLOYEMENT_ID", value: deployment._id.toString() },
            ],
          },
        ],
      },
    });
    await ecsClient.send(command);

    return res.json({
      status: "queued",
      data: { deploymentId: deployment._id },
    });
  } catch (error) {
    console.error("Deployment Error:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const getDeploymentsByProjectId = async (req, res) => {
  try {
    const { projectId } = req.params;
    const deployments = await Deployement.find({ projectId: projectId });

    res.status(200).json({ deployments: deployments });
  } catch (error) {
    console.error("Error fetching deployments:", error);

    res.status(500).json({ message: "Something Went" });
  }
};

export const getDeployementById = async (req, res) => {
  try {
    const { deploymentId } = req.params;
    const deployement = await Deployement.findById(deploymentId);
    if (!deployement) {
      return res
        .status(400)
        .json({ message: "Deployment with this id not Found" });
    }

    return res
      .status(200)
      .json({ message: "success", deployement: deployement });
  } catch (error) {
    console.error("Error sendig deployment by id", error);
    res.status(500).json({ message: "something went wrong" });
  }
};
