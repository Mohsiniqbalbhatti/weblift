import "dotenv/config";
import express from "express";
import deployementRouter from "./routers/deployementRouter.js";
import projectRouter from "./routers/projectRouter.js";
import logsRouter from "./routers/logsRouter.js";
import { initKafkaConsumer } from "./controllers/kafkaConsumer.js";
import userRouter from "./routers/userRouter.js";
import { connectDB } from "./config/database.js";
import cookie from "cookie-parser";
import cors from "cors";

const app = express();
const PORT = 9000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "DELETE"],
  })
);
app.use(cookie());
await connectDB();

initKafkaConsumer();
app.use(express.json());
app.use("/user", userRouter);
app.use("/project", projectRouter);
app.use("/logs", logsRouter);
app.use("/deploy", deployementRouter);

app.listen(PORT, () => console.log(`API Server Running on port ${PORT}`));
