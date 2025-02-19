import { ECSClient, RunTaskCommand } from "@aws-sdk/client-ecs";
import { generateSlug } from "random-word-slugs";
import { configDotenv } from "dotenv";

configDotenv();
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
    const { gitURL, slug } = req.body;
    const projectSlug = slug || generateSlug();
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
              { name: "GIT_REPOSITORY_URL", value: gitURL },
              { name: "PROJECT_ID", value: projectSlug },
            ],
          },
        ],
      },
    });

    await ecsClient.send(command);

    return res.json({
      status: "queued",
      data: { projectSlug, url: `http://${projectSlug}.localhost:8000` },
    });
  } catch (error) {
    console.error("Deployment Error:", error);
    return res.status(500).json({ error: error.message });
  }
};
