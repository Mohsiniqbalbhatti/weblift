import { execSync } from "child_process";
import path from "path";
import fs from "fs";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import mime from "mime-types";
import { fileURLToPath } from "url";
import { configDotenv } from "dotenv";
import { Kafka, Partitioners } from "kafkajs";
configDotenv();
// Fix __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use environment variables for sensitive information

const s3Client = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const PROJECT_ID = process.env.PROJECT_ID;
const DEPLOYEMENT_ID = process.env.DEPLOYEMENT_ID;
const BUILD_COMMAND = process.env.BUILD_COMMAND;
// configure kafka
const kafka = new Kafka({
  clientId: `docker-build-server ${DEPLOYEMENT_ID}`,
  brokers: [process.env.KAFKA_BROKER],
  ssl: {
    rejectUnauthorized: false,
    ca: [fs.readFileSync(path.join(__dirname, "kafka.pem"), "utf-8")],
  },
  sasl: {
    username: process.env.KAFKA_USERNAME,
    password: process.env.KAFKA_PASSWORD,
    mechanism: "plain",
  },
  connectionTimeout: 30000,
});

// setting up kakfa producer
const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});
// Modified: Wait for Redis to confirm logs are sent
const publishLog = async (log) => {
  await producer.send({
    topic: "logs",
    messages: [
      {
        key: "log",
        value: JSON.stringify({ PROJECT_ID, DEPLOYEMENT_ID, log }),
      },
    ],
  });
};

const init = async () => {
  await producer.connect();
  console.log("Executing script.js");
  await publishLog("Build Started...");

  const outDirPath = path.join(__dirname, "output");

  // Run build synchronously to prevent process hanging
  try {
    execSync(`cd ${outDirPath} && npm install && ${BUILD_COMMAND}`, {
      stdio: "inherit",
    });
    await publishLog("Build Complete");
  } catch (error) {
    await publishLog(`Build Failed: ${error.message}`);
    console.error("Build Error:", error);
    process.exit(1);
  }

  const distFolderPath = path.join(__dirname, "output", "dist");
  const distFolderContents = fs.readdirSync(distFolderPath, {
    recursive: true,
  });

  await publishLog("Starting to upload");

  for (const file of distFolderContents) {
    const filePath = path.join(distFolderPath, file);
    if (fs.lstatSync(filePath).isDirectory()) continue;

    console.log("Uploading", file);
    await publishLog(`Uploading ${file}`);

    // Upload to S3
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: "webliftfyp1",
        Key: `__output/${PROJECT_ID}/${file}`,
        Body: fs.createReadStream(filePath),
        ContentType: mime.lookup(filePath) || "application/octet-stream",
      },
    });

    upload.on("httpUploadProgress", async (progress) => {
      console.log(`Upload Progress: ${progress.loaded} bytes`);
      await publishLog(`Upload Progress: ${progress.loaded} bytes`);
    });

    await upload.done(); // Ensure upload completes
    console.log("Uploaded", file);
    await publishLog(`Uploaded ${file}`);
  }

  await publishLog("Done");
  console.log("Done...");
  process.exit(0);
};

init();
